import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const rawConnectionString = process.env.DATABASE_URL;

if (!rawConnectionString) {
  throw new Error(
    "DATABASE_URL não está configurada. Copie .env.example para .env e defina a URL do PostgreSQL."
  );
}

// pg-connection-string trata 'prefer', 'require' e 'verify-ca' como 'verify-full'.
// Normalizar evita o aviso de segurança sem alterar o comportamento da conexão.
const connectionString = rawConnectionString.replace(
  /([?&])sslmode=(prefer|require|verify-ca)(?=(&|$))/i,
  "$1sslmode=verify-full"
);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
