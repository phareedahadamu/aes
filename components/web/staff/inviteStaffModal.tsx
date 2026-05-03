"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { Info } from "lucide-react";

const InviteStaffForm = dynamic(
  () => import("@/components/web/staff/inviteStaffForm"),
  {
    ssr: false,
    loading: () => (
      <span>
        <Loader2 size="16" className="animate-spin text-primary" />
      </span>
    ),
  },
);
export default function InviteStaffModal() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button className="py-3! px-11! rounded-mid gap-2.5! text-base!">
            <Plus className="size-6" /> Invite Staff
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="gap-5!">
          <DialogTitle>Invite Staff Member</DialogTitle>
          <DialogDescription className="text-info rounded-mid border border-info p-4 text-lg! gap-2! flex! flex-row! bg-info/10 items-center">
            <Info className="text-info size-6!" />
            An email invite will be sent with a link to set their password. They
            will be active immediately upon signing in.
          </DialogDescription>
        </DialogHeader>
        <InviteStaffForm />
      </DialogContent>
    </Dialog>
  );
}
