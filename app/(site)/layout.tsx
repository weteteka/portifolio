import { redirect } from "next/navigation";
import { getPortfolioData } from "@/lib/db";
import { hasAnyUser } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";

export const instant = false;

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await hasAnyUser())) {
    redirect("/admin/setup");
  }

  const data = await getPortfolioData();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-emerald-500 selection:text-white w-full overflow-x-hidden">
      <Navbar name={data.profile.name} role={data.profile.role} />

      <main className="flex-1 flex flex-col w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
