import { NextResponse } from "next/server";
import { hashPassword, createSession, hasAnyUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    if (await hasAnyUser()) {
      return NextResponse.json(
        { error: "O cadastro de novas contas está desabilitado." },
        { status: 403 }
      );
    }

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

    const alreadyExists = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (alreadyExists) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado no sistema." },
        { status: 409 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        name: trimmedName,
        email: trimmedEmail,
        passwordHash: await hashPassword(cleanPassword),
      },
    });

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
