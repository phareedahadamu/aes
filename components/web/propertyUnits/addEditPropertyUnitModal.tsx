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
import type { Unit } from "@/generated/prisma/client";
import { Dispatch, SetStateAction } from "react";

const AddEditPropertyUnitForm = dynamic(
  () => import("./addEditPropertyUnitForm"),
  {
    ssr: false,
    loading: () => (
      <span>
        <Loader2 size="16" className="animate-spin text-primary" />
      </span>
    ),
  },
);
export default function AddEditPropertyUnitsModal({
  isOpen,
  setIsOpen,
  action,
  unit,
}:
  | {
      unit: Unit;
      action: "edit";
      isOpen: boolean;
      setIsOpen: Dispatch<SetStateAction<boolean>>;
    }
  | {
      unit?: never;
      action: "add";
      isOpen?: never;
      setIsOpen?: never;
    }) {
  const normalizedAction = normalizeText(action);
  const description =
    action === "edit"
      ? "Update the details for this existing unit. Changes will reflect across your property listings immediately."
      : "Register a new property unit. Assign a unique code and set a starting price to get started.";

  return (
    <Dialog
      open={typeof isOpen === "boolean" ? isOpen : undefined}
      onOpenChange={typeof isOpen === "boolean" ? setIsOpen : undefined}
    >
      {action === "add" && (
        <DialogTrigger
          render={
            <Button className="py-3! px-11! rounded-mid gap-2.5! text-base!">
              <Plus className="size-6" /> {normalizedAction} Unit
            </Button>
          }
        />
      )}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="gap-5!">
          <DialogTitle>{normalizedAction} Property Unit</DialogTitle>
          <DialogDescription className="text-info rounded-mid border border-info p-4 text-lg! gap-2! flex! flex-row! bg-info/10 items-center">
            <Info className="text-info size-6!" />
            {description}
          </DialogDescription>
        </DialogHeader>
        {action === "edit" ? (
          <AddEditPropertyUnitForm
            action={action}
            unit={unit}
            closeModal={() => {
              setIsOpen(false);
            }}
          />
        ) : (
          <AddEditPropertyUnitForm action={action} />
        )}
      </DialogContent>
    </Dialog>
  );
}
