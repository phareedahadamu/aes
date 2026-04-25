"use client";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {Info, Loader2 } from "lucide-react";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InviteStaffSchema } from "@/lib/dal/staff/schema.staff";
import { Role } from "@/generated/prisma/enums";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { normalizeText } from "@/lib/utils";
import { toast } from "sonner";
import { useActionState, useEffect, startTransition } from "react";
import {
  sendStaffInvite,
  resendStaffInvite,
} from "@/lib/dal/staff/inviteStaff";
import * as z from "zod";

export default function InviteStaffModal() {
  const [sendResponse, sendAction, isPendingSend] = useActionState(
    sendStaffInvite,
    null,
  );
  const [resendResponse, resendAction, isPendingResend] = useActionState(
    resendStaffInvite,
    null,
  );
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(InviteStaffSchema),
    defaultValues: {
      email: "",
      role: "REPORTS" as Role,
    },
    resetOptions: { keepDirtyValues: true },
    mode: "all",
  });

  const roleOptions = Object.values(Role).map((value, index) => (
    <SelectItem key={index} value={value}>
      {normalizeText(value)}
    </SelectItem>
  ));

  const onSubmit: SubmitHandler<z.infer<typeof InviteStaffSchema>> = (data) => {
    const email = data.email.trim();
    const role = data.role;
    startTransition(() => {
      if (sendResponse?.data?.isDuplicate) {
        resendAction({ email, role });
      } else {
        sendAction({ email, role });
      }
    });
  };

  useEffect(() => {
    if (sendResponse) {
      if (sendResponse.success) toast.success(sendResponse.data.message);
      else toast.error(sendResponse.data.message);
    }
  }, [sendResponse]);
  useEffect(() => {
    if (resendResponse) {
      if (resendResponse.success) toast.success(resendResponse.message);
      else toast.error(resendResponse.message);
    }
  }, [resendResponse]);

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader className="gap-5!">
        <DialogTitle>Invite Staff Member</DialogTitle>
        <DialogDescription className="text-info rounded-mid border border-info p-4 text-lg! gap-2! flex! flex-row! bg-info/10 items-center">
          <Info className="text-info size-6!" />
          An email invite will be sent with a link to set their password. They
          will be active immediately upon signing in.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  disabled={
                    isPendingSend ||
                    isPendingResend ||
                    sendResponse?.data.isDuplicate
                  }
                  placeholder="Enter email"
                />
              )}
            />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>
          <Field>
            <FieldLabel htmlFor="role">Role</FieldLabel>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  disabled={isPendingSend || isPendingResend}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  {...field}
                >
                  <SelectTrigger className="">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>{roleOptions}</SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && <FieldError>{errors.role.message}</FieldError>}
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose
            render={
              <Button
                disabled={isPendingSend || isPendingResend}
                variant="outline"
                type="button"
                className="font-medium text-lg! rounded-mid px-5! py-1.5!"
              >
                Cancel
              </Button>
            }
          />
          {(!sendResponse ||
            (sendResponse && !sendResponse.data.isDuplicate)) && (
            <Button
              disabled={isPendingSend || !isValid}
              type="submit"
              variant="secondary"
              className="text-background font-medium text-lg! rounded-mid w-30! py-1.5!"
            >
              {isPendingSend ? (
                <Loader2 className="animate-spin text-white size-3.5" />
              ) : (
                "Send Invite"
              )}
            </Button>
          )}
          {sendResponse && sendResponse.data.isDuplicate && (
            <Button
              disabled={isPendingResend || !isValid}
              type="submit"
              variant="secondary"
              className="text-background font-medium text-lg! rounded-mid w-30! py-1.5!"
            >
              {isPendingResend ? (
                <Loader2 className="animate-spin text-white size-3.5" />
              ) : (
                "Resend Invite"
              )}
            </Button>
          )}
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
