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
import type {
  Property,
  Street,
  Customer,
  Ward,
  Unit,
} from "@/generated/prisma/client";
import { Dispatch, SetStateAction } from "react";
import AddPropertiesStepper from "./addPropertiesStepper";
import { useState } from "react";
import { ADDPROPERTYSTEPS } from "@/lib/types/properties";
import AddPropertiesFooter from "./addPropertiesFooter";
import OwnerTab from "@/components/web/properties/ownerTab";
import LocationTab from "@/components/web/properties/locationTab";
import UnitsTab from "@/components/web/properties/unitsTab";
import PreviewTab from "@/components/web/properties/previewTab";
import { customScrollbar } from "@/lib/utils";
import { AddEditPropertySchema } from "@/lib/dal/properties/schema.properties";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { StreamlinedCustomerType } from "@/lib/dal/customers/getCustomers";
import { TStreamLinedWard } from "@/lib/dal/service-areas/getServiceAreas";
import { TStreamlinedStreet } from "@/lib/dal/service-areas/streets/getStreets";

export default function AddEditPropertyModal({
  isOpen,
  setIsOpen,
  action,
  property,
  origin,
  owner,
  street,
  ward,
  disabled = false,
  units,
}: { disabled?: boolean } & (
  | {
      property: Property;
      action: "edit";
      isOpen: boolean;
      setIsOpen: Dispatch<SetStateAction<boolean>>;
      origin: "editProperty";
      owner: Customer;
      ward: Ward;
      street: Street;
      units: Unit[];
    }
  | {
      property?: never;
      action: "add";
      isOpen?: never;
      setIsOpen?: never;
      origin: "propertiesPage";
      owner?: never;
      ward?: never;
      street?: never;
      units?: never;
    }
  | {
      property?: never;
      action: "add";
      isOpen?: never;
      setIsOpen?: never;
      origin: "customerDetailsPage";
      owner: Customer;
      ward?: never;
      street?: never;
      units?: never;
    }
)) {
  const methods = useForm({
    resolver: zodResolver(AddEditPropertySchema),
    defaultValues: {
      ownerId: property ? property.ownerId || "" : "",
      streetId: property ? property.streetId : "",
      address: property ? property.address : "",
      propertyCode: property ? property.code : "",
    },
    // resetOptions: { keepDirtyValues: true },
    mode: "all",
  });

  const [selectedCustomer, setSelectedCustomer] =
    useState<StreamlinedCustomerType | null>(
      (origin === "customerDetailsPage" || origin === "editProperty") && owner
        ? {
            id: owner.id,
            name: owner.name,
            email: owner.email,
            phoneNo: owner.phoneNo,
          }
        : null,
    );
  const [selectedWard, setSelectedWard] = useState<TStreamLinedWard | null>(
    ward ? { id: ward.id, name: ward.name, code: ward.code } : null,
  );
  const [selectedStreet, setSelectedStreet] =
    useState<TStreamlinedStreet | null>(
      street ? { id: street.id, name: street.name, code: street.code } : null,
    );
  const onSubmit: SubmitHandler<z.infer<typeof AddEditPropertySchema>> = (
    data,
  ) => {
    console.log(data);
  };
  const scrollBarStyles = customScrollbar.join(" ").replace('"', "");
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentStep = ADDPROPERTYSTEPS.find(
    (val) => val.index === currentIndex,
  );
  const activeComponent =
    currentStep?.name === "Owner" ? (
      <OwnerTab
        origin={origin}
        owner={owner}
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
      />
    ) : currentStep?.name === "Location" ? (
      <LocationTab
        selectedStreet={selectedStreet}
        setSelectedStreet={setSelectedStreet}
        selectedWard={selectedWard}
        setSelectedWard={setSelectedWard}
      />
    ) : currentStep?.name === "Units" ? (
      <UnitsTab />
    ) : currentStep?.name === "Preview" ? (
      <PreviewTab />
    ) : null;
  const handleBack = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((prev) => prev - 1);
  };
  const handleContinue = () => {
    if (currentIndex >= ADDPROPERTYSTEPS.length - 1) return;
    setCurrentIndex((prev) => prev + 1);
  };
  const normalizedAction = normalizeText(action);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = methods;
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
              disabled={disabled}
            >
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
        <FormProvider {...methods}>
          <form>
            <div
              className={`w-full flex min-h-100 overflow-y-auto ${scrollBarStyles}`}
            >
              {activeComponent}
            </div>
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
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
