"use client";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import PasswordInput from "../passwordInput";
import {
  useForm,
  Controller,
  SubmitHandler,
  useWatch,
  FormProvider,
} from "react-hook-form";
import {
  useState,
  startTransition,
  useActionState,
  useEffect,
  useEffectEvent,
} from "react";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordSchema } from "@/lib/authActions/schema.auth";
import PasswordValidationDisplay from "../passwordValidationDisplay";
import { upDatePassword } from "@/lib/authActions/updateProfile";
import { toast } from "sonner";
import * as z from "zod";

export default function ChangePassword() {
  const [response, submitAction, isPending] = useActionState(
    upDatePassword,
    null,
  );
  const [editMode, setEditMode] = useState(false);
  const methods = useForm({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "all",
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = methods;

  const [showPasswordValidation, setShowPasswordValidation] = useState(false);
  const watchedPassword = useWatch({ control, name: "newPassword" }).trim();
  const onSubmit: SubmitHandler<z.infer<typeof ChangePasswordSchema>> = (
    data,
  ) => {
    const currentPassword = data.currentPassword.trim();
    const newPassword = data.newPassword.trim();
    startTransition(() => submitAction({ currentPassword, newPassword }));
  };
  const updateEditMode = useEffectEvent(() => {
    setEditMode(false);
    reset();
  });
  useEffect(() => {
    if (response) {
      if (response.success) {
        updateEditMode();

        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    }
  }, [response]);

  return (
    <FormProvider {...methods}>
      {!editMode ? (
        <Button
          variant="link"
          type="button"
          onClick={() => setEditMode(true)}
          className="w-fit! py-0! h-fit!"
        >
          Change password
        </Button>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4"
        >
          <Field>
            <FieldLabel>Current Password</FieldLabel>
            <Controller
              name="currentPassword"
              render={({ field }) => (
                <PasswordInput
                  {...field}
                  autoComplete="off"
                  disabled={isPending}
                />
              )}
            />
            {errors.currentPassword && (
              <FieldError>{errors.currentPassword.message}</FieldError>
            )}
          </Field>
          <Field className="relative">
            <FieldLabel>New Password</FieldLabel>
            <PasswordInput
              name="newPassword"
              autoComplete="off"
              disabled={isPending}
              onClick={() => setShowPasswordValidation(true)}
              onBlur={() => setShowPasswordValidation(false)}
            />
            {errors.newPassword && (
              <FieldError>{errors.newPassword.message}</FieldError>
            )}
            {showPasswordValidation && (
              <PasswordValidationDisplay watchedPassword={watchedPassword} />
            )}
          </Field>
          <Field>
            <FieldLabel>Confirm Password</FieldLabel>
            <Controller
              name="confirmPassword"
              render={({ field }) => (
                <PasswordInput
                  {...field}
                  autoComplete="off"
                  disabled={isPending}
                />
              )}
            />
            {errors.confirmPassword && (
              <FieldError>{errors.confirmPassword.message}</FieldError>
            )}
          </Field>
          <FieldGroup className=" flex-row! gap-0!">
            <Field className="w-fit!">
              <Button
                className="w-fit!"
                variant="link"
                type="button"
                onClick={() => {
                  reset();

                  setEditMode(false);
                }}
              >
                Cancel
              </Button>
            </Field>
            <Field className="w-fit!">
              <Button
                type="submit"
                disabled={!isDirty || isPending || !isValid}
                variant="ghost"
                className="w-fit"
              >
                {isPending ? (
                  <Loader2
                    className="animate-spin text-muted-foreground"
                    size={16}
                  />
                ) : (
                  <>
                    <Save />
                    Save
                  </>
                )}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      )}
    </FormProvider>
  );
}
