"use client";

import BreadCrumbs from "./breadCrumbs";
import ProfileModalButton from "../profile/profileModalButton";
import { User } from "@/generated/prisma/client";

export default function AppHeader({ user }: { user: User }) {
  return (
    <header className="w-full bg-background h-23 flex items-center justify-between pl-7.5 pr-6">
      <BreadCrumbs />
      <ProfileModalButton user={user} />
    </header>
  );
}
