import { createHash, randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse, connection } from "next/server";
import { getSessionUser } from "@/lib/auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const CLOUDINARY_FOLDER = "portfolio";

interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

function matches(bytes: Buffer, signature: readonly number[]): boolean {
  return (
    bytes.length >= signature.length &&
    signature.every((byte, index) => bytes[index] === byte)
  );
}

function imageExtension(bytes: Buffer, mimeType: string): string | null {
  switch (mimeType) {
    case "image/png":
      return matches(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
        ? "png"
        : null;
    case "image/jpeg":
      return matches(bytes, [0xff, 0xd8, 0xff]) ? "jpg" : null;
    case "image/gif":
      return matches(bytes, [0x47, 0x49, 0x46, 0x38]) ? "gif" : null;
    case "image/webp":
      return bytes.toString("ascii", 0, 4) === "RIFF" &&
        bytes.toString("ascii", 8, 12) === "WEBP"
        ? "webp"
        : null;
    default:
      return null;
  }
}

function cloudinarySignature(
  params: Record<string, string>,
  apiSecret: string
): string {
  const serialized = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1")
    .update(`${serialized}${apiSecret}`)
    .digest("hex");
}

async function uploadToCloudinary(
  config: CloudinaryConfig,
  bytes: Buffer,
  mimeType: string
): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const paramsToSign = { folder: CLOUDINARY_FOLDER, timestamp };
  const signature = cloudinarySignature(paramsToSign, config.apiSecret);

  const body = new FormData();
  body.append("api_key", config.apiKey);
  body.append("timestamp", timestamp);
  body.append("folder", CLOUDINARY_FOLDER);
  body.append("signature", signature);
  body.append("file", `data:${mimeType};base64,${bytes.toString("base64")}`);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/image/upload`,
    { method: "POST", body }
  );

  const result = (await response.json()) as {
    secure_url?: string;
    error?: { message?: string };
  };

  if (!response.ok || !result.secure_url) {
    throw new Error(result.error?.message || "Falha no upload para o Cloudinary.");
  }

  return result.secure_url;
}

export async function POST(request: Request) {
  // A sessão é por requisição; sair do prerender evita cache pendente.
  await connection();

  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json(
        { error: "Faça login como administrador para enviar imagens." },
        { status: 401 }
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
    const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
    const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

    let cloudinaryConfig: CloudinaryConfig | null = null;
    if (cloudName || apiKey || apiSecret) {
      if (!cloudName || !apiKey || !apiSecret) {
        return NextResponse.json(
          {
            error:
              "Configuração do Cloudinary incompleta. Defina CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET.",
          },
          { status: 500 }
        );
      }
      cloudinaryConfig = { cloudName, apiKey, apiSecret };
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Nenhum arquivo de imagem foi enviado." },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { error: "O arquivo enviado está vazio." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "A imagem deve ter no máximo 5 MB." },
        { status: 400 }
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const extension = imageExtension(bytes, file.type);

    if (!extension) {
      return NextResponse.json(
        { error: "Use uma imagem PNG, JPG, WEBP ou GIF válida." },
        { status: 400 }
      );
    }

    if (cloudinaryConfig) {
      try {
        const url = await uploadToCloudinary(cloudinaryConfig, bytes, file.type);
        return NextResponse.json({ url, storage: "cloudinary" });
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        return NextResponse.json(
          { error: "Erro ao enviar a imagem para o Cloudinary." },
          { status: 502 }
        );
      }
    }

    // Sem credenciais do Cloudinary, mantemos o fallback local para dev.
    // Em ambientes serverless o filesystem é somente leitura e public é
    // fixado no build, então o campo de URL continua disponível como saída.
    if (process.env.VERCEL) {
      return NextResponse.json(
        {
          error:
            "Configure o Cloudinary para enviar imagens neste ambiente. Use uma URL de imagem externa enquanto isso.",
        },
        { status: 503 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filename = `${randomUUID()}.${extension}`;
    await writeFile(path.join(uploadDir, filename), bytes);

    return NextResponse.json({ url: `/uploads/${filename}`, storage: "local" });
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;

    if (code === "EROFS" || code === "EACCES" || code === "EPERM") {
      return NextResponse.json(
        {
          error:
            "Não foi possível gravar em public/uploads. Configure o Cloudinary ou use uma URL de imagem externa.",
        },
        { status: 503 }
      );
    }

    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Erro ao enviar a imagem." },
      { status: 500 }
    );
  }
}
