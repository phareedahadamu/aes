"use client ";
import { Button } from "@/components/ui/button";
import {
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { User } from "@/generated/prisma/client";
import { X } from "lucide-react";
import UpdateUserName from "./updateUserName";
import StatusRolePill from "../statusRolePill";
import ChangePassword from "./changePassword";

export default function ProfileModal({ user }: { user: User }) {
  return (
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
      <section className="flex flex-col gap-8">
        <section className="flex flex-col gap-4">
          <h2 className="font-medium text-base">Personal Information</h2>
          <hr />
          <UpdateUserName userName={user.name} />
          <div className="flex flex-col gap-1 text-base">
            <p className="font-medium">Email</p>
            <p className="border border-border rounded-mid py-3 px-4">
              {user.email}
            </p>
          </div>
          <div className="w-full grid grid-cols-2 text-base">
            <div className="flex flex-col gap-3">
              <p className="font-medium">Role</p>

              <StatusRolePill
                type="role"
                role={user.isSuperAdmin ? "Super Admin" : user.role}
              />
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-medium">Status</p>

              <StatusRolePill type="status" isActive={user.isActive} />
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-medium text-base">Security</h2>
          <hr />
          <ChangePassword />
        </section>
      </section>
    </DrawerContent>
  );
}
