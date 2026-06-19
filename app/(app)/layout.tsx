import SideBar from "@/components/web/navigation/sideBar";
import AppHeader from "@/components/web/navigation/appHeader";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User } from "@/generated/prisma/client";
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();
  if (!user) {
    redirect("/login");
  }
  // console.log(user);
  return (
    <main className="w-full flex">
      <SideBar role={(user as User).role} />
      <section className="w-full flex flex-col bg-muted">
        <AppHeader user={user as User} />
        <section className="pt-4.5 pl-7.5 pr-6 pb-7.5 min-h-[calc(100dvh - 92px)] h-full">
          {children}
        </section>
      </section>
    </main>
  );
}
