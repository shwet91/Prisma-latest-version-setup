import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <DashboardShell
      userName={session.user?.name ?? "User"}
      userImage={session.user?.image ?? undefined}
      userEmail={session.user?.email ?? undefined}
    />
  );
}
