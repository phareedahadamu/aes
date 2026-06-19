"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, HousePlus } from "lucide-react";
import dynamic from "next/dynamic";
import { normalizeText } from "@/lib/utils";
import type { Property, Street, Customer } from "@/generated/prisma/client";
import { Dispatch, SetStateAction } from "react";
import AddPropertiesStepper from "./addPropertiesStepper";
import { useState } from "react";
import { ADDPROPERTYSTEPS } from "@/lib/types/properties";
import AddPropertiesFooter from "./addPropertiesFooter";

// const AddEditCustomerForm = dynamic(() => import("./addEditCustomerForm"), {
//   ssr: false,
//   loading: () => (
//     <span>
//       <Loader2 size="16" className="animate-spin text-primary" />
//     </span>
//   ),
// });
type ExtendedProperty = {
  owner: (Customer & { _count: { properties: number } }) | null;
  street: Street;
} & Property;
export default function AddEditPropertyModal({
  isOpen,
  setIsOpen,
  action,
  property,
  origin,
  ownerId,
}: (
  | {
      property: ExtendedProperty;
      action: "edit";
      isOpen: boolean;
      setIsOpen: Dispatch<SetStateAction<boolean>>;
    }
  | {
      property?: never;
      action: "add";
      isOpen?: never;
      setIsOpen?: never;
    }
) &
  (
    | {
        origin: "propertiesPage";
        ownerId?: never;
      }
    | {
        origin: "customerDetailsPage";
        ownerId: string;
      }
  )) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentStep = ADDPROPERTYSTEPS.find(
    (val) => val.index === currentIndex,
  );
  const handleBack = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((prev) => prev - 1);
  };
  const handleContinue = () => {
    if (currentIndex >= ADDPROPERTYSTEPS.length - 1) return;
    setCurrentIndex((prev) => prev + 1);
  };
  const normalizedAction = normalizeText(action);

  return (
    <Dialog
      open={typeof isOpen === "boolean" ? isOpen : undefined}
      onOpenChange={typeof isOpen === "boolean" ? setIsOpen : undefined}
    >
      {action === "add" && (
        <DialogTrigger
          render={
            <Button className="py-3! px-11! rounded-mid gap-2.5! text-base!">
              <HousePlus className="size-6" /> {normalizedAction} Property
            </Button>
          }
        />
      )}
      <DialogContent className="sm:max-w-225 w-[98%]">
        <DialogHeader className="gap-5!">
          <DialogTitle>{normalizedAction} Property</DialogTitle>
          <DialogDescription className="sr-only">
            {action === "add"
              ? "Go through the steps to add a new property"
              : "Edit property details"}
          </DialogDescription>
          <AddPropertiesStepper currentIndex={currentIndex} />
        </DialogHeader>
        <form>
          <DialogFooter>
            {currentStep && (
              <AddPropertiesFooter
                currentStep={currentStep.name}
                handleBack={handleBack}
                handleContinue={handleContinue}
              />
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
