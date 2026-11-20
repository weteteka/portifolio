import { NextResponse } from "next/server";
import { getPortfolioData, savePortfolioData } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { PortfolioData } from "@/types/portfolio";

export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Get portfolio error:", error);
    return NextResponse.json(
      { error: "Erro ao carregar dados do portfólio." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json(
        { error: "Acesso não autorizado. Faça login como administrador." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const currentData = await getPortfolioData();

    // Deep merge or replace fields cleanly
    const updatedData: PortfolioData = {
      profile: body.profile ? { ...currentData.profile, ...body.profile } : currentData.profile,
      skills: Array.isArray(body.skills) ? body.skills : currentData.skills,
      strengths: Array.isArray(body.strengths) ? body.strengths : currentData.strengths,
      languages: Array.isArray(body.languages) ? body.languages : currentData.languages,
      tools: Array.isArray(body.tools) ? body.tools : currentData.tools,
      recommendations: Array.isArray(body.recommendations) ? body.recommendations : currentData.recommendations,
      projects: Array.isArray(body.projects) ? body.projects : currentData.projects,
      experiences: Array.isArray(body.experiences) ? body.experiences : currentData.experiences,
      socials: Array.isArray(body.socials) ? body.socials : currentData.socials,
    };

    await savePortfolioData(updatedData);

    return NextResponse.json({
      success: true,
      message: "Dados do portfólio atualizados com sucesso!",
      data: updatedData,
    });
  } catch (error) {
    console.error("Update portfolio error:", error);
    return NextResponse.json(
      { error: "Erro ao salvar alterações no portfólio." },
      { status: 500 }
    );
  }
}
