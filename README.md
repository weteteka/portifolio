This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Banco de dados (PostgreSQL + Prisma)

O projeto persiste os dados do portfólio e os usuários administradores em PostgreSQL através do Prisma.

```bash
cp .env.example .env
npm run db:up        # sobe o container do PostgreSQL na porta 5434
npm run db:migrate   # cria/aplica as migrations
npm run db:seed      # popula dados iniciais (e importa data/*.json, se existirem)
npm run dev
```

Outros comandos úteis: `npm run db:deploy` (aplica migrations em produção), `npm run db:generate` (regera o client), `npm run db:studio` e `npm run db:down`.

> A porta host padrão é **5434** porque a porta 5432 já está ocupada por outro container neste ambiente. Ajuste `POSTGRES_PORT` e `DATABASE_URL` no `.env` se necessário.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
