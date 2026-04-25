"use client";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldGroup,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
  useState,
  startTransition,
  useActionState,
  useEffect,
  useEffectEvent,
} from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { UpdateUserNameSchema } from "@/lib/authActions/schema.auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Save, Loader2 } from "lucide-react";
import * as z from "zod";
import { upDateUserName } from "@/lib/authActions/updateProfile";
import { toast } from "sonner";
import { getSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function UpdateUserName({ userName }: { userName: string }) {
  const router = useRouter();
  const [response, submitAction, isPending] = useActionState(
    upDateUserName,
    null,
  );
  const [editMode, setEditMode] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: zodResolver(UpdateUserNameSchema),
    defaultValues: {
      name: userName,
    },
    mode: "all",
  });

  const onSubmit: SubmitHandler<z.infer<typeof UpdateUserNameSchema>> = (
    data,
  ) => {
    const name = data.name.trim();
    startTransition(() => submitAction({ name }));
  };
  const updateEditMode = useEffectEvent(() => {
    router.refresh();
    setEditMode(false);
  });
  useEffect(() => {
    if (response) {
      if (response.success) {
        const syncSession = async () => {
          await getSession({
            query: { disableCookieCache: true },
          });
          updateEditMode();
          toast.success(response.message);
        };
        syncSession();
      } else {
        toast.error(response.message);
      }
    }
  }, [response]);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <FieldSet className="gap-1!">
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter name"
                min={2}
                max={30}
                readOnly={!editMode}
                disabled={isPending}
              />
            )}
          />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>
        <FieldGroup className=" flex-row! gap-0!">
          <Field className="w-fit!">
            <Button
              className="w-fit!"
              variant={editMode ? "link" : "ghost"}
              type="button"
              onClick={() => {
                if (editMode) {
                  reset();
                }
                setEditMode((prev) => !prev);
              }}
            >
              {!editMode ? (
                <>
                  <Edit /> Edit
                </>
              ) : (
                "Cancel"
              )}
            </Button>
          </Field>
          {editMode && (
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
          )}
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
