import { NextResponse } from "next/server";
import { logoutUser } from "@/lib/auth";

export async function POST() {
  try {
    await logoutUser();
    return NextResponse.json({ success: true, message: "Sessão encerrada com sucesso." });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Erro ao encerrar sessão." },
      { status: 500 }
    );
  }
}
