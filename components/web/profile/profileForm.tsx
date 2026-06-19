"use client ";
import { User } from "@/generated/prisma/client";
import UpdateUserName from "./updateUserName";
import StatusRolePill from "../statusRolePill";
import ChangePassword from "./changePassword";

export default function ProfileForm({ user }: { user: User }) {
  return (
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
        <div className="w-full grid grid-cols-2 gap-4 text-base">
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
  );
}
