"use client";
import { Button } from "../../ui/button";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
export default function SignOutButton() {
  const router = useRouter();
  function handleSignOut() {
    try {
      signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
          },
        },
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }
  return (
    <Button
      variant="ghost"
      onClick={handleSignOut}
      className="text-destructive font-medium w-full px-2! py-3! text-start flex justify-start text-base"
    >
      <LogOut className="size-6 text-inherit" />
      Log Out
    </Button>
  );
}
