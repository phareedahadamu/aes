"use client";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

const InviteStaffModal = dynamic(
  () => import("@/components/web/staff/inviteStaffModal"),
  {
    ssr: false,
    loading: () => (
      <span>
        <Loader2 size="16" className="animate-spin text-primary" />
      </span>
    ),
  },
);
export default function InviteStaffButton() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button className="py-3! px-11! rounded-mid gap-2.5! text-base!">
            <Plus className="size-6" /> Invite Staff
          </Button>
        }
      />
      <InviteStaffModal />
    </Dialog>
  );
}
