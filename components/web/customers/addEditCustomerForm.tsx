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
import { ALL_CUSTOMERS_QKEY } from "@/lib/constants/general";
import type { Customer } from "@/generated/prisma/client";
import { AddEditCustomerSchema } from "@/lib/dal/customers/schema.customers";
import {
  addCustomer,
  editCustomer,
} from "@/lib/dal/customers/customersActions";
import { PhoneInput } from "@/components/web/phoneNoInput";

export default function AddEditCustomerForm({
  action,
  customer,
  closeModal,
}:
  | {
      customer: Customer;
      action: "edit";
      closeModal: () => void;
    }
  | {
      customer?: never;
      action: "add";
      closeModal?: never;
    }) {
  const normalizedAction = normalizeText(action);
  const [addResponse, addAction, isPendingAdd] = useActionState(
    addCustomer,
    null,
  );
  const [editResponse, editAction, isPendingEdit] = useActionState(
    editCustomer,
    null,
  );
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: zodResolver(AddEditCustomerSchema),
    defaultValues: {
      name: customer ? customer.name : "",
      email: customer ? (customer.email ?? "") : "",
      phoneNo: customer ? customer.phoneNo : "",
      address: customer ? customer.address : "",
    },
    // resetOptions: { keepDirtyValues: true },
    mode: "all",
  });
  const onSubmit: SubmitHandler<z.infer<typeof AddEditCustomerSchema>> = (
    data,
  ) => {
    const name = data.name.trim();
    const email = data.email;
    const phoneNo = data.phoneNo.trim();
    const address = data.address;
    startTransition(() => {
      if (action === "add") {
        addAction({ name, email, phoneNo, address });
      } else {
        const customerId = customer.id;
        editAction({ name, address, email, phoneNo, customerId });
      }
    });
  };
  const queryClient = useQueryClient();
  const invalidateQuery = useEffectEvent(() => {
    queryClient.invalidateQueries({
      queryKey: [ALL_CUSTOMERS_QKEY],
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
          <FieldLabel
            htmlFor="name"
            className="after:ml-0.5 after:text-red-500 after:content-['*']"
          >
            Name
          </FieldLabel>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                disabled={isPendingAdd || isPendingEdit}
                placeholder="Enter customer name"
              />
            )}
          />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                disabled={isPendingAdd || isPendingEdit}
                placeholder="Enter customer email"
              />
            )}
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>
        <Field>
          <FieldLabel
            htmlFor="address"
            className="after:ml-0.5 after:text-red-500 after:content-['*']"
          >
            Address
          </FieldLabel>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                disabled={isPendingAdd || isPendingEdit}
                placeholder="Enter customer address"
              />
            )}
          />
          {errors.address && <FieldError>{errors.address.message}</FieldError>}
        </Field>
        <Field>
          <FieldLabel
            htmlFor="phoneNo"
            className="after:ml-0.5 after:text-red-500 after:content-['*']"
          >
            Phone Number
          </FieldLabel>
          <Controller
            name="phoneNo"
            control={control}
            render={({ field }) => (
              <PhoneInput
                defaultCountry="NG"
                placeholder="eg. +2348000000000"
                {...field}
              />
            )}
          />
          {errors.phoneNo && <FieldError>{errors.phoneNo.message}</FieldError>}
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
            `${normalizedAction} Customer`
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
