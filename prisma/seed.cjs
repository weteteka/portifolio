/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs/promises");
const path = require("node:path");
const bcrypt = require("bcryptjs");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL não está configurada. Copie .env.example para .env.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const projectRoot = path.resolve(__dirname, "..");
const PROFILE_ID = "profile-main";

async function readLegacyJson(relativePath) {
  try {
    const raw = await fs.readFile(path.join(projectRoot, relativePath), "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function replacePortfolioData(data) {
  await prisma.$transaction(async (tx) => {
    await tx.profile.upsert({
      where: { id: PROFILE_ID },
      create: { id: PROFILE_ID, ...data.profile },
      update: { ...data.profile },
    });

    await Promise.all([
      tx.skill.deleteMany(),
      tx.strength.deleteMany(),
      tx.language.deleteMany(),
      tx.tool.deleteMany(),
      tx.recommendation.deleteMany(),
      tx.project.deleteMany(),
      tx.experience.deleteMany(),
      tx.socialLink.deleteMany(),
    ]);

    await Promise.all([
      tx.skill.createMany({ data: data.skills }),
      tx.strength.createMany({ data: data.strengths }),
      tx.language.createMany({ data: data.languages }),
      tx.tool.createMany({ data: data.tools }),
      tx.recommendation.createMany({ data: data.recommendations }),
      tx.project.createMany({ data: data.projects }),
      tx.experience.createMany({ data: data.experiences }),
      tx.socialLink.createMany({ data: data.socials }),
    ]);
  });
}

async function main() {
  const existingProfile = await prisma.profile.findUnique({
    where: { id: PROFILE_ID },
  });

  if (existingProfile) {
    console.log("Portfólio já populado — nada a fazer.");
  } else {
    const defaultData = require("../data/default-portfolio.json");
    const legacyPortfolio = await readLegacyJson("data/portfolio.json");
    await replacePortfolioData(legacyPortfolio ?? defaultData);
    console.log(
      legacyPortfolio
        ? "Portfólio importado de data/portfolio.json."
        : "Portfólio populado com os dados padrão."
    );
  }

  const userCount = await prisma.user.count();
  if (userCount > 0) {
    console.log("Usuários administradores já existem — nada a fazer.");
  } else {
    const legacyUsers = await readLegacyJson("data/users.json");
    if (legacyUsers?.length) {
      await prisma.user.createMany({
        data: legacyUsers.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          passwordHash: user.passwordHash,
          createdAt: new Date(user.createdAt),
        })),
      });
      console.log(`${legacyUsers.length} usuário(s) importado(s) de data/users.json.`);
    } else {
      await prisma.user.create({
        data: {
          id: "admin-default",
          name: "Administrador",
          email: "admin@portfolio.com",
          passwordHash: await bcrypt.hash("admin123", 10),
        },
      });
      console.log("Administrador padrão criado: admin@portfolio.com / admin123");
    }
  }
}

main()
  .catch((error) => {
    console.error("Falha ao popular o banco de dados:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
