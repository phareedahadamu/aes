"use client";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { User } from "@/generated/prisma/client";
import { normalizeText } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const ProfileModal = dynamic(
  () => import("@/components/web/profile/profileModal"),
  {
    ssr: false,
    loading: () => (
      <span>
        <Loader2 size="16" className="animate-spin text-primary" />
      </span>
    ),
  },
);
export default function ProfileModalButton({ user }: { user: User }) {
  return (
    <Drawer direction="right">
      <DrawerTrigger className="flex! gap-2! items-center max-w-62.5 w-full rounded-mid  px-2! py-1.5! justify-start! border border-border cursor-pointer hover:bg-muted">
        <span className="size-12 rounded-full bg-secondary text-background font-medium leading-12 text-4xl">
          {user.name[0].toUpperCase()}
        </span>
        <p className="flex flex-col gap-0.5">
          <span className="font-medium">{normalizeText(user.name)}</span>
          <span className="text-muted-foreground text-lg">
            {user.isSuperAdmin
              ? "Super Admin"
              : normalizeText(user.role as string)}
          </span>
        </p>
      </DrawerTrigger>
      
      <ProfileModal user={user} />
    </Drawer>
  );
}
