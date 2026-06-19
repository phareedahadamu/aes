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
  ALL_STREETS_QKEY,
  ALL_SERVICE_AREAS_QKEY,
  SERVICE_AREAS_METRICS_QKEY,
} from "@/lib/constants/general";
import type { Street } from "@/generated/prisma/client";
import { AddEditStreetSchema } from "@/lib/dal/service-areas/streets/schema.streets";
import {
  addStreet,
  editStreet,
} from "@/lib/dal/service-areas/streets/streetsActions";

export default function AddEditStreetForm({
  action,
  street,
  closeModal,
  wardId,
}:
  | {
      street: Street;
      action: "edit";
      closeModal: () => void;
      wardId: string;
    }
  | {
      street?: never;
      action: "add";
      closeModal?: never;
      wardId: string;
    }) {
  const normalizedAction = normalizeText(action);
  const [addResponse, addAction, isPendingAdd] = useActionState(
    addStreet,
    null,
  );
  const [editResponse, editAction, isPendingEdit] = useActionState(
    editStreet,
    null,
  );
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: zodResolver(AddEditStreetSchema),
    defaultValues: {
      code: street ? street.code : "",
      name: street ? street.name : "",
    },
    // resetOptions: { keepDirtyValues: true },
    mode: "all",
  });

  const onSubmit: SubmitHandler<z.infer<typeof AddEditStreetSchema>> = (
    data,
  ) => {
    const name = data.name.trim();
    const code = data.code.trim();
    startTransition(() => {
      if (action === "add") {
        addAction({ name, code, wardId });
      } else {
        const streetId = street.id;
        editAction({ name, code, streetId });
      }
    });
  };
  const queryClient = useQueryClient();
  const invalidateQuery = useEffectEvent(() => {
    queryClient.invalidateQueries({
      queryKey: [ALL_SERVICE_AREAS_QKEY],
    });
    queryClient.invalidateQueries({
      queryKey: [SERVICE_AREAS_METRICS_QKEY],
    });
    queryClient.invalidateQueries({
      queryKey: [ALL_STREETS_QKEY],
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
                placeholder="Enter street code"
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
                placeholder="Enter street name"
              />
            )}
          />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
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
            `${normalizedAction} Street`
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
