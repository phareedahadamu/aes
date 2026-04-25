import LoginForm from "@/components/web/auth/loginForm";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function LoginPage() {
  const user = await getAuthUser();
  if (user) {
    redirect("/");
  }
  return (
    <div className="flex flex-col gap-7.25 w-full max-w-113.75">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-3xl font-medium">Welcome Back </h2>
        <p className="text-muted-foreground">
          Sign in to access your workspace.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
