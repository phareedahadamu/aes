"use client";
import type { Ward, Street } from "@/generated/prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { AddEditPropertySchema } from "@/lib/dal/properties/schema.properties";
import * as z from "zod";
import { useState, Dispatch, SetStateAction } from "react";
import { TStreamLinedWard } from "@/lib/dal/service-areas/getServiceAreas";
import { TStreamlinedStreet } from "@/lib/dal/service-areas/streets/getStreets";
import { Pen } from "lucide-react";
import WardSearchInput from "../inputsAndFilters/wardSearchInput";
import StreetSearchInput from "../inputsAndFilters/streetsSearchInput";

type LocationTabProps = {
  ward?: Ward;
  street?: Street;
  selectedStreet: TStreamlinedStreet | null;
  setSelectedStreet: Dispatch<SetStateAction<TStreamlinedStreet | null>>;
  selectedWard: TStreamLinedWard | null;
  setSelectedWard: Dispatch<SetStateAction<TStreamLinedWard | null>>;
};
export default function LocationTab({
  selectedStreet,
  setSelectedStreet,
  selectedWard,
  setSelectedWard,
}: LocationTabProps) {
  const {
    control,
    resetField,
    setValue: setFieldValue,
    formState: { errors },
  } = useFormContext<z.infer<typeof AddEditPropertySchema>>();
  const wardId = useWatch({ control, name: "wardId" });
  const [editStreetModeOpen, setEditStreetModeOpen] = useState(false);
  return (
    <div className="w-full flex flex-col gap-6 py-4">
      <div className="grid grid-cols-2 gap-4 w-full ">
        <Field>
          <FieldLabel htmlFor="propertyCode">Property Code</FieldLabel>
          <Controller
            name="propertyCode"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter property code name"
                className="w-full"
              />
            )}
          />
          {errors.propertyCode && (
            <FieldError>{errors.propertyCode.message}</FieldError>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="propertyCode">Building Number</FieldLabel>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter building number"
                className="w-full"
              />
            )}
          />
          {errors.address && <FieldError>{errors.address.message}</FieldError>}
        </Field>
      </div>
      {!editStreetModeOpen && (
        <div className="flex flex-col gap-4">
          <Field>
            <FieldLabel>Ward</FieldLabel>

            <Input value={selectedWard?.name || "-"} disabled />
          </Field>

          <Field>
            <FieldLabel>Street</FieldLabel>

            <Input value={selectedStreet?.name || "-"} disabled />
          </Field>
          <div className="w-full flex justify-end">
            <Button
              variant="link"
              onClick={() => {
                setEditStreetModeOpen(true);
              }}
            >
              <Pen /> Edit
            </Button>
          </div>
        </div>
      )}
      {editStreetModeOpen && (
        <div className="flex flex-col gap-4">
          <Field>
            <FieldLabel>Ward</FieldLabel>

            <WardSearchInput
              value={selectedWard}
              setValue={setSelectedWard}
              setFieldValue={(id: string) => {
                setFieldValue("wardId", id);
              }}
            />
          </Field>
          <Field>
            <FieldLabel>Street</FieldLabel>

            <StreetSearchInput
              value={selectedStreet}
              wardId={wardId}
              setValue={setSelectedStreet}
              setFieldValue={(id: string) => {
                setFieldValue("streetId", id);
              }}
            />
          </Field>
          <div className="w-full flex justify-end">
            <Button
              variant="ghost"
              onClick={() => {
                resetField("wardId");
                resetField("streetId");
                setEditStreetModeOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="link"
              onClick={() => {
                setEditStreetModeOpen(false);
              }}
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
