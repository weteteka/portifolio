import { NextResponse } from "next/server";
import { getUsers } from "@/lib/db";
import { verifyPassword, createSession, ensureInitialAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await ensureInitialAdmin();
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const users = await getUsers();
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      return NextResponse.json(
        { error: "Credenciais inválidas. Verifique seu e-mail e senha." },
        { status: 401 }
      );
    }

    const passwordMatch = await verifyPassword(password, user.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Credenciais inválidas. Verifique seu e-mail e senha." },
        { status: 401 }
      );
    }

    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao tentar realizar login." },
      { status: 500 }
    );
  }
}
