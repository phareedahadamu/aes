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
import { normalizeText } from "@/lib/utils";
import type { Ward } from "@/generated/prisma/client";
import { Dispatch, SetStateAction } from "react";

const AddEditWardForm = dynamic(() => import("./addEditWardForm"), {
  ssr: false,
  loading: () => (
    <span>
      <Loader2 size="16" className="animate-spin text-primary" />
    </span>
  ),
});
export default function AddEditWardModal({
  isOpen,
  setIsOpen,
  action,
  ward,
}:
  | {
      ward: Ward;
      action: "edit";
      isOpen: boolean;
      setIsOpen: Dispatch<SetStateAction<boolean>>;
    }
  | {
      ward?: never;
      action: "add";
      isOpen?: never;
      setIsOpen?: never;
    }) {
  const normalizedAction = normalizeText(action);
  const description =
    "A Ward is a top-level service area. Streets are added inside each ward.";

  return (
    <Dialog
      open={typeof isOpen === "boolean" ? isOpen : undefined}
      onOpenChange={typeof isOpen === "boolean" ? setIsOpen : undefined}
    >
      {action === "add" && (
        <DialogTrigger
          render={
            <Button className="py-3! px-11! rounded-mid gap-2.5! text-base!">
              <Plus className="size-6" /> {normalizedAction} Ward
            </Button>
          }
        />
      )}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="gap-5!">
          <DialogTitle>{normalizedAction} Ward</DialogTitle>
          <DialogDescription className="text-info rounded-mid border border-info p-4 text-lg! gap-2! flex! flex-row! bg-info/10 items-center">
            <Info className="text-info size-6!" />
            {description}
          </DialogDescription>
        </DialogHeader>
        {action === "edit" ? (
          <AddEditWardForm
            action={action}
            ward={ward}
            closeModal={() => {
              setIsOpen(false);
            }}
          />
        ) : (
          <AddEditWardForm action={action} />
        )}
      </DialogContent>
    </Dialog>
  );
}
