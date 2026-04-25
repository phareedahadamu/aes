import { verifyToken } from "@/lib/authActions/registerActions";
import RegisterForm from "@/components/web/auth/registerForm";
import { KeyRound } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
type SearchParams = Promise<{ token: string | undefined }>;
export default async function RegisterPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await getAuthUser();
    if (user) {
      redirect("/");
    }
  const token = (await searchParams).token;
  if (!token) {
    notFound();
  }

  const invitationResult = await verifyToken(token);

  if (!invitationResult.success || !invitationResult.invitation) {
    return (
      <div className="flex flex-col justify-center items-center p-4 min-h-screen gap-4">
        <KeyRound size="64" strokeWidth={1.5} className="text-accent" />
        <div className="flex flex-col gap-0.5 text-center">
          <h2 className="text-2xl">{invitationResult.message}</h2>
          <p className="text-chart-2">
            Contact your administrator for assistance.
          </p>
          <p className="pt-6 text-lg">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }
  const email = invitationResult.invitation.email;
  const role = invitationResult.invitation.role;
  return (
    <div className="flex flex-col gap-7.25 w-full ">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-3xl font-medium">Welcome to the Team </h2>
        <p className="text-muted-foreground">
          Set up your password to access your workspace.
        </p>
      </div>
      <RegisterForm email={email} token={token} role={role} />
    </div>
  );
}
