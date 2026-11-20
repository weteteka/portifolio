import { NextResponse, connection } from "next/server";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  // A sessão é por requisição. Sair do prerender evita que a private cache
  // de getSessionUser fique pendente durante a geração de páginas estáticas.
  await connection();

  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.userId,
        email: session.email,
        name: session.name,
      },
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json(
      { error: "Erro ao verificar autenticação." },
      { status: 500 }
    );
  }
}
