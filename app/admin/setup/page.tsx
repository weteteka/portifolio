import { redirect } from "next/navigation";
import { getSessionUser, hasAnyUser } from "@/lib/auth";
import { SetupForm } from "./SetupForm";

export default async function AdminSetupPage() {
  if (await hasAnyUser()) {
    const session = await getSessionUser();
    redirect(session ? "/admin" : "/admin/login");
  }

  return <SetupForm />;
}
