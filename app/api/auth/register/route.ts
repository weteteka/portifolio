import { NextResponse } from "next/server";
import { getUsers, saveUsers } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";
import { User } from "@/types/portfolio";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nome, e-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password);

    if (trimmedName.length < 2) {
      return NextResponse.json(
        { error: "O nome deve ter no mínimo 2 caracteres." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { error: "Por favor, insira um endereço de e-mail válido." },
        { status: 400 }
      );
    }

    if (cleanPassword.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres." },
        { status: 400 }
      );
    }

    const users = await getUsers();
    const alreadyExists = users.some((u) => u.email.toLowerCase() === trimmedEmail);

    if (alreadyExists) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado no sistema." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(cleanPassword);
    const newUser: User = {
      id: `admin-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: trimmedName,
      email: trimmedEmail,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await saveUsers(users);

    await createSession({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Conta administrativa criada com sucesso!",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao tentar registrar conta." },
      { status: 500 }
    );
  }
}
