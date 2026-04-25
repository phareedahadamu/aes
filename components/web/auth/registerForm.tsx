"use client";
import { RegisterUserSchema } from "@/lib/authActions/schema.auth";
import {
  useForm,
  Controller,
  SubmitHandler,
  FormProvider,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, startTransition, useEffect, useState } from "react";
import { registerUser } from "@/lib/authActions/registerActions";
import {
  FieldGroup,
  FieldLabel,
  Field,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import PasswordInput from "@/components/web/passwordInput";
import { normalizeText } from "@/lib/utils";
import PasswordValidationDisplay from "../passwordValidationDisplay";

export default function RegisterForm({
  email,
  role,
  token,
}: {
  email: string;
  role: string;
  token: string;
}) {
  const router = useRouter();
  //   Form
  const methods = useForm({
    resolver: zodResolver(RegisterUserSchema),
    defaultValues: {
      name: "",
      password: "",
      confirmPassword: "",
    },
    resetOptions: { keepDirtyValues: true },
    mode: "all",
  });
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = methods;
  //   States
  const [response, submitAction, isPending] = useActionState(
    registerUser,
    null,
  );
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);

  const watchedPassword = useWatch({ control, name: "password" }).trim();

  const onSubmit: SubmitHandler<z.infer<typeof RegisterUserSchema>> = (
    data,
  ) => {
    // console.log(data);
    const name = data.name.trim();
    const password = data.password.trim();
    startTransition(() => submitAction({ token, name, password }));
  };
  //   Effects
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (response) {
      if (response.success) {
        toast.success(response.message);
        timeoutId = setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        toast.error(response.message);
      }
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [response, router]);
  //   console.log(response);
  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col gap-4 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FieldGroup>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input defaultValue={email} readOnly />
          </Field>
          <Field>
            <FieldLabel>Role</FieldLabel>
            <Input defaultValue={normalizeText(role)} readOnly />
          </Field>
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="Enter name"
                  min={2}
                  max={30}
                />
              )}
            />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>
          <Field className="relative">
            <FieldLabel>Password</FieldLabel>
            <PasswordInput
              name="password"
              autoComplete="off"
              disabled={isPending}
              onClick={() => setShowPasswordValidation(true)}
              onBlur={() => setShowPasswordValidation(false)}
            />
            {errors.password && (
              <FieldError>{errors.password.message}</FieldError>
            )}
            {showPasswordValidation && (
              <PasswordValidationDisplay watchedPassword={watchedPassword} />
            )}
          </Field>
          <Field>
            <FieldLabel>Confirm Password</FieldLabel>
            <PasswordInput
              name="confirmPassword"
              disabled={isPending}
              autoComplete="off"
            />
            {errors.confirmPassword && (
              <FieldError>{errors.confirmPassword.message}</FieldError>
            )}
          </Field>
          <Field className="pt-4">
            <Button
              type="submit"
              disabled={!isValid || isPending}
              className="w-full text-base font-medium "
            >
              {isPending ? (
                <LoaderCircle className="animate-spin size-4" />
              ) : (
                "Activate Account"
              )}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </FormProvider>
  );
}
