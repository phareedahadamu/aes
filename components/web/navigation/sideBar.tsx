"use client";
import SignOutButton from "./signOutButton";
import SideBarNavs from "./sideBarNavs";
import { Role } from "@/generated/prisma/enums";
import Image from "next/image";
import { customScrollbar } from "@/lib/utils";
export default function SideBar({ role }: { role: Role }) {
  const scrollBarStyles = customScrollbar.join(" ").replace('"', "");
  return (
    <aside
      className={`w-61.5 h-screen overflow-y-auto  pt-4 pb-10 px-5 flex flex-col gap-44 border-r border-border text-base ${scrollBarStyles} justify-between`}
    >
      <header className="flex flex-col w-full gap-6">
        <Image
          width={127}
          height={139}
          src="/logo.png"
          alt="archer enviroclean logo"
          className="w-15 h-auto"
        />
        <nav className="w-full gap-4 flex flex-col">
          <SideBarNavs role={role} />
        </nav>
      </header>
      <footer>
        <SignOutButton />
      </footer>
    </aside>
  );
}
