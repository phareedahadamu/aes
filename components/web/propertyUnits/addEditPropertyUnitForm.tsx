"use client";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { normalizeText } from "@/lib/utils";
import { toast } from "sonner";
import {
  useActionState,
  useEffect,
  startTransition,
  useEffectEvent,
} from "react";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  ALL_PROPERTY_UNITS_QKEY,
  PROPERTY_UNITS_METRICS_QKEY,
} from "@/lib/constants/general";
import type { Unit } from "@/generated/prisma/client";
import { AddEditPropertyUnitSchema } from "@/lib/dal/property-units/schema.propertyUnits";
import {
  addPropertyUnit,
  editPropertyUnit,
} from "@/lib/dal/property-units/propertyUnitsActions";

export default function AddEditPropertyUnitForm({
  action,
  unit,
  closeModal,
}:
  | {
      unit: Unit;
      action: "edit";
      closeModal: () => void;
    }
  | {
      unit?: never;
      action: "add";
      closeModal?: never;
    }) {
  const normalizedAction = normalizeText(action);
  const [addResponse, addAction, isPendingAdd] = useActionState(
    addPropertyUnit,
    null,
  );
  const [editResponse, editAction, isPendingEdit] = useActionState(
    editPropertyUnit,
    null,
  );
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: zodResolver(AddEditPropertyUnitSchema),
    defaultValues: {
      code: unit ? unit.code : "",
      name: unit ? unit.name : "",
      price: unit ? unit.price : 0,
    },
    // resetOptions: { keepDirtyValues: true },
    mode: "all",
  });

  const onSubmit: SubmitHandler<z.infer<typeof AddEditPropertyUnitSchema>> = (
    data,
  ) => {
    const name = data.name.trim();
    const code = data.code.trim();
    const price = Number(data.price);
    startTransition(() => {
      if (action === "add") {
        addAction({ name, code, price });
      } else {
        const unitId = unit.id;
        editAction({ name, code, price, unitId });
      }
    });
  };
  const queryClient = useQueryClient();
  const invalidateQuery = useEffectEvent(() => {
    queryClient.invalidateQueries({
      queryKey: [ALL_PROPERTY_UNITS_QKEY],
    });
    queryClient.invalidateQueries({
      queryKey: [PROPERTY_UNITS_METRICS_QKEY],
    });
    if (closeModal) closeModal();
  });
  useEffect(() => {
    if (addResponse) {
      if (addResponse.success) {
        toast.success(addResponse.message);
        invalidateQuery();
        reset();
      } else toast.error(addResponse.message);
    }
  }, [addResponse, reset]);
  useEffect(() => {
    if (editResponse) {
      if (editResponse.success) {
        toast.success(editResponse.message);
        invalidateQuery();
      } else toast.error(editResponse.message);
    }
  }, [editResponse]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="code">Code</FieldLabel>
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                disabled={isPendingAdd || isPendingEdit}
                placeholder="Enter unit name"
              />
            )}
          />
          {errors.code && <FieldError>{errors.code.message}</FieldError>}
        </Field>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                disabled={isPendingAdd || isPendingEdit}
                placeholder="Enter unit name"
              />
            )}
          />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>
        <Field>
          <FieldLabel htmlFor="name">{`Price (₦)`}</FieldLabel>
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                {...field}
                disabled={isPendingAdd || isPendingEdit}
                value={(field.value as number) || undefined}
              />
            )}
          />
          {errors.price && <FieldError>{errors.price.message}</FieldError>}
        </Field>
      </FieldGroup>
      <DialogFooter>
        <DialogClose
          render={
            <Button
              disabled={isPendingAdd || isPendingEdit}
              variant="outline"
              type="button"
              className="font-medium text-lg! rounded-mid px-5! py-1.5!"
            >
              Cancel
            </Button>
          }
        />

        <Button
          disabled={isPendingAdd || !isValid || isPendingEdit || !isDirty}
          type="submit"
          variant="secondary"
          className="text-background font-medium text-lg! rounded-mid w-30! py-1.5!"
        >
          {isPendingAdd || isPendingEdit ? (
            <Loader2 className="animate-spin text-white size-3.5" />
          ) : (
            `${normalizedAction} Unit`
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
