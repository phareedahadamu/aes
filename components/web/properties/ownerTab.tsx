"use client";
import type { Customer } from "@/generated/prisma/client";
import { Dispatch, SetStateAction } from "react";
import { StreamlinedCustomerType } from "@/lib/dal/customers/getCustomers";
import CustomerSearchInput from "../inputsAndFilters/customerSearchInput";
import { useFormContext, useWatch } from "react-hook-form";
import * as z from "zod";
import { AddEditPropertySchema } from "@/lib/dal/properties/schema.properties";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

type OwnerTabProps = {
  origin: "propertiesPage" | "customerDetailsPage" | "editProperty";
  owner?: Customer | undefined;
  selectedCustomer: StreamlinedCustomerType | null;
  setSelectedCustomer: Dispatch<SetStateAction<StreamlinedCustomerType | null>>;
};

export default function OwnerTab({
  origin,
  owner,
  selectedCustomer,
  setSelectedCustomer,
}: OwnerTabProps) {
  const {
    control,
    setValue: setFieldValue,
    formState: { errors },
  } = useFormContext<z.infer<typeof AddEditPropertySchema>>();
  const ownerDetails = useWatch({ control, name: "ownerId" });
  console.log("Owner Details", ownerDetails);

  return (
    <div className="w-full flex flex-col gap-6 py-4">
      {(origin === "propertiesPage" ||
        (origin === "customerDetailsPage" && !owner) ||
        (origin === "editProperty" && !owner)) && (
        <Field>
          <FieldLabel>Search customer by name or email</FieldLabel>
          <CustomerSearchInput
            value={selectedCustomer}
            setValue={setSelectedCustomer}
            setFieldValue={(id: string) => {
              setFieldValue("ownerId", id);
            }}
          />
          {errors.ownerId && <FieldError>{errors.ownerId.message}</FieldError>}
        </Field>
      )}
      {selectedCustomer && (
        <div className="w-full bg-accent rounded-mid border border-primary px-4 py-2 ">
          <p className="text-xl font-medium">{selectedCustomer.name}</p>
          <p className="text-accent-foreground text-lg">
            {selectedCustomer.email || "-"} | {selectedCustomer.phoneNo}
          </p>
        </div>
      )}
    </div>
  );
}
