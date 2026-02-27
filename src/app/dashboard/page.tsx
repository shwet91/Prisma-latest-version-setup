import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import SignOutButton from "@/components/auth/SignOutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-900">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Welcome, {session.user?.name ?? "User"}!
          </p>
        </div>

        {session.user?.image && (
          <div className="mb-4 flex justify-center">
            <img
              src={session.user.image}
              alt="Profile"
              className="h-16 w-16 rounded-full"
            />
          </div>
        )}

        <div className="mb-6 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
          <p>
            <span className="font-medium">Email:</span> {session.user?.email}
          </p>
          <p>
            <span className="font-medium">Name:</span> {session.user?.name}
          </p>
        </div>

        <SignOutButton />
      </div>
    </div>
  );
}
