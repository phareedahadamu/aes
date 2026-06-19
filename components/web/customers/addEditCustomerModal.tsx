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
import { normalizeText } from "@/lib/utils";
import type { Customer } from "@/generated/prisma/client";
import { Dispatch, SetStateAction } from "react";
import { TButtonVariant } from "@/lib/types/general";

const AddEditCustomerForm = dynamic(() => import("./addEditCustomerForm"), {
  ssr: false,
  loading: () => (
    <span>
      <Loader2 size="16" className="animate-spin text-primary" />
    </span>
  ),
});
export default function AddEditCustomerModal({
  isOpen,
  setIsOpen,
  action,
  customer,
  variant = "default",
}:
  | {
      customer: Customer;
      action: "edit";
      isOpen: boolean;
      setIsOpen: Dispatch<SetStateAction<boolean>>;
      variant?: TButtonVariant;
    }
  | {
      customer?: never;
      action: "add";
      isOpen?: never;
      setIsOpen?: never;
      variant?: TButtonVariant;
    }) {
  const normalizedAction = normalizeText(action);

  return (
    <Dialog
      open={typeof isOpen === "boolean" ? isOpen : undefined}
      onOpenChange={typeof isOpen === "boolean" ? setIsOpen : undefined}
    >
      {action === "add" && (
        <DialogTrigger
          render={
            <Button
              className="py-3! px-11! rounded-mid gap-2.5! text-base!"
              variant={variant}
            >
              <Plus className={`${variant === "link" ? "size-3" : "size-6"}`} />{" "}
              {normalizedAction} Customer
            </Button>
          }
        />
      )}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="gap-5!">
          <DialogTitle>{normalizedAction} Customer</DialogTitle>
          <DialogDescription className="sr-only">
            {action === "add"
              ? "Fill the form to add a new customer"
              : "Edit customer details"}
          </DialogDescription>
        </DialogHeader>
        {action === "edit" ? (
          <AddEditCustomerForm
            action={action}
            customer={customer}
            closeModal={() => {
              setIsOpen(false);
            }}
          />
        ) : (
          <AddEditCustomerForm action={action} />
        )}
      </DialogContent>
    </Dialog>
  );
}
