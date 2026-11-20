import { redirect } from "next/navigation";
import { getSessionUser, hasAnyUser } from "@/lib/auth";

export const instant = false;

export default async function AdminRegisterPage() {
  if (!(await hasAnyUser())) {
    redirect("/admin/setup");
  }

  const session = await getSessionUser();
  if (session) {
    redirect("/admin");
  }

  redirect("/admin/login");
}
