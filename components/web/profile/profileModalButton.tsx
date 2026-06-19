"use client";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { User } from "@/generated/prisma/client";
import { normalizeText } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { X } from "lucide-react";

const ProfileForm = dynamic(
  () => import("@/components/web/profile/profileForm"),
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

      <DrawerContent className="max-w-147.5! w-full p-4! pb-6! gap-6 overflow-y-auto overflow-x-hidden">
        <DrawerDescription className="sr-only">
          Adjust your account settings and preferences here.
        </DrawerDescription>
        <DrawerHeader className="relative px-0!">
          <DrawerTitle className="text-xl! font-medium!">
            Edit Profile
          </DrawerTitle>
          <DrawerClose asChild>
            <Button
              variant="ghost"
              className="w-fit! absolute right-0 top-[50%] -translate-y-[50%] py-2! size-fit! px-2!"
            >
              <X className="size-5" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <ProfileForm user={user} />
      </DrawerContent>
    </Drawer>
  );
}
