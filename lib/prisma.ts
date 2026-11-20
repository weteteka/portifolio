import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

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

const POOL_MAX = 3;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaPoolMax: number | undefined;
};

function createPrisma(): PrismaClient {
  // O Next dev possui vários runtimes (RSC, SSR, route handlers). Cada um com
  // seu próprio módulo e, portanto, seu próprio pool. O padrão do pg é 10
  // conexões por pool, o que esgota rapidamente bancos remotos com limite
  // baixo. Limitamos a 3 conexões por client; as demais consultas ficam na fila.
  const pool = new Pool({
    connectionString,
    max: POOL_MAX,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  });

  return new PrismaClient({
    adapter: new PrismaPg(pool, { disposeExternalPool: true }),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

let client = globalForPrisma.prisma;

// Durante o HMR, o globalThis sobrevive à troca de módulo. Se ele guarda um
// client da configuração antiga, fechamos o pool antigo antes de criar o novo.
if (client && globalForPrisma.prismaPoolMax !== POOL_MAX) {
  void client.$disconnect().catch(() => {});
  client = undefined;
}

if (!client) {
  client = createPrisma();
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = client;
  globalForPrisma.prismaPoolMax = POOL_MAX;
}

export const prisma = client;
