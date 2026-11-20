import { redirect } from "next/navigation";
import { getSessionUser, hasAnyUser } from "@/lib/auth";
import { getPortfolioData } from "@/lib/db";
import { AdminDashboard } from "./AdminDashboard";

export const instant = false;

export default async function AdminPage() {
  if (!(await hasAnyUser())) {
    redirect("/admin/setup");
  }

  const session = await getSessionUser();

  if (!session) {
    redirect("/admin/login");
  }

  const portfolioData = await getPortfolioData();

  return (
    <AdminDashboard
      initialData={portfolioData}
      user={{
        id: session.userId,
        email: session.email,
        name: session.name,
      }}
    />
  );
}
