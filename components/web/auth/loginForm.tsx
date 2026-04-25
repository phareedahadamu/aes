"use client";
import {
  useForm,
  Controller,
  SubmitHandler,
  FormProvider,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginUserSchema } from "@/lib/authActions/schema.auth";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { FieldGroup, FieldLabel, Field, FieldError } from "../../ui/field";
import { loginUser } from "@/lib/authActions/loginActions";
import { useActionState, startTransition, useEffect } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import PasswordInput from "../passwordInput";
export default function LoginForm() {
  const router = useRouter();
  //   Form
  const methods = useForm({
    resolver: zodResolver(LoginUserSchema),
    defaultValues: {
      email: "",
      password: "",
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
  const [response, submitAction, isPending] = useActionState(loginUser, null);
  const onSubmit: SubmitHandler<z.infer<typeof LoginUserSchema>> = (data) => {
    const email = data.email;
    const password = data.password;
    startTransition(() => submitAction({ email, password }));
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

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col gap-4 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FieldGroup>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Controller
              name="email"
              control={control}
              render={({ field }) => <Input {...field} disabled={isPending} />}
            />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>
          <Field>
            <FieldLabel>Password</FieldLabel>

            <PasswordInput
              name="password"
              disabled={isPending}
              autoComplete="off"
            />
            {errors.password && (
              <FieldError>{errors.password.message}</FieldError>
            )}
          </Field>
          <Field className="pt-4">
            <Button
              type="submit"
              disabled={!isValid || isPending}
              className="w-full"
            >
              {isPending ? (
                <LoaderCircle className="animate-spin size-4" />
              ) : (
                "Log In"
              )}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </FormProvider>
  );
}
