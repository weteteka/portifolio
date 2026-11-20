import { redirect } from "next/navigation";
import { getSessionUser, hasAnyUser } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export default async function AdminLoginPage() {
  if (!(await hasAnyUser())) {
    redirect("/admin/setup");
  }

  const session = await getSessionUser();
  if (session) {
    redirect("/admin");
  }

  return <LoginForm />;
}
