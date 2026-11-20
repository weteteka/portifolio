import { NextResponse, connection } from "next/server";
import { getPortfolioData } from "@/lib/db";
import { isBrevoConfigured, sendContactEmail } from "@/lib/brevo";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LENGTH = 2000;

interface ContactBody {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  company?: unknown;
}

export async function POST(request: Request) {
  await connection();

  let body: ContactBody;

  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json(
      { error: "Requisição inválida." },
      { status: 400 }
    );
  }

  // Honeypot: bots preenchem todos os campos. Silenciosamente aceitamos e
  // descartamos a submissão sem chamar o Brevo.
  if (typeof body.company === "string" && body.company.trim()) {
    return NextResponse.json({ success: true });
  }

  const name =
    typeof body.name === "string"
      ? body.name.trim().replace(/\s+/g, " ")
      : "";
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (name.length < 2 || name.length > 100) {
    return NextResponse.json(
      { error: "Informe seu nome (entre 2 e 100 caracteres)." },
      { status: 400 }
    );
  }

  if (!EMAIL_REGEX.test(email) || email.length > 254) {
    return NextResponse.json(
      { error: "Informe um e-mail válido." },
      { status: 400 }
    );
  }

  if (message.length < 10 || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      {
        error: `A mensagem deve ter entre 10 e ${MAX_MESSAGE_LENGTH} caracteres.`,
      },
      { status: 400 }
    );
  }

  if (!isBrevoConfigured()) {
    return NextResponse.json(
      {
        error:
          "O envio de mensagens não está disponível no momento. Tente novamente mais tarde.",
      },
      { status: 503 }
    );
  }

  try {
    const { profile } = await getPortfolioData();

    if (!EMAIL_REGEX.test(profile.email)) {
      return NextResponse.json(
        { error: "O destinatário da mensagem não está configurado." },
        { status: 503 }
      );
    }

    await sendContactEmail({
      to: { email: profile.email, name: profile.name || "Portfólio" },
      replyTo: { email, name },
      name,
      message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact email error:", error);
    return NextResponse.json(
      {
        error:
          "Não foi possível enviar sua mensagem. Tente novamente mais tarde.",
      },
      { status: 502 }
    );
  }
}
