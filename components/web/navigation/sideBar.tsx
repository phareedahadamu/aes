"use client";
import SignOutButton from "./signOutButton";
import SideBarNavs from "./sideBarNavs";
import { Role } from "@/generated/prisma/enums";
import Image from "next/image";
export default function SideBar({ role }: { role: Role }) {
  return (
    <aside className="w-60 h-screen overflow-y-auto  py-4 px-5 flex flex-col justify-between border-r border-border text-base">
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
