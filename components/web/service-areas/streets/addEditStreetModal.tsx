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
import type { Street } from "@/generated/prisma/client";
import { Dispatch, SetStateAction } from "react";

const AddEditStreetForm = dynamic(() => import("./addEditStreetForm"), {
  ssr: false,
  loading: () => (
    <span>
      <Loader2 size="16" className="animate-spin text-primary" />
    </span>
  ),
});
export default function AddEditStreetModal({
  isOpen,
  setIsOpen,
  action,
  street,
  wardId,
}:
  | {
      street: Street;
      action: "edit";
      isOpen: boolean;
      setIsOpen: Dispatch<SetStateAction<boolean>>;
      wardId: string;
    }
  | {
      street?: never;
      action: "add";
      isOpen?: never;
      setIsOpen?: never;
      wardId: string;
    }) {
  const normalizedAction = normalizeText(action);
  const description =
    action === "add"
      ? "Assign a new street to this ward for property onboarding"
      : "Edit the details of this street";

  return (
    <Dialog
      open={typeof isOpen === "boolean" ? isOpen : undefined}
      onOpenChange={typeof isOpen === "boolean" ? setIsOpen : undefined}
    >
      {action === "add" && (
        <DialogTrigger
          render={
            <Button
              className="py-3! px-11! rounded-mid gap-2.5! text-base! border-primary! text-primary!"
              variant="outline"
            >
              <Plus className="size-6" /> {normalizedAction} Street
            </Button>
          }
        />
      )}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="gap-5!">
          <DialogTitle>{normalizedAction} Street</DialogTitle>
          <DialogDescription className="text-info rounded-mid border border-info p-4 text-lg! gap-2! flex! flex-row! bg-info/10 items-center">
            <Info className="text-info size-6!" />
            {description}
          </DialogDescription>
        </DialogHeader>
        {action === "edit" ? (
          <AddEditStreetForm
            action={action}
            street={street}
            closeModal={() => {
              setIsOpen(false);
            }}
            wardId={wardId}
          />
        ) : (
          <AddEditStreetForm action={action} wardId={wardId} />
        )}
      </DialogContent>
    </Dialog>
  );
}
