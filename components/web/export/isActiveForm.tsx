"use client";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IsActiveFormSchema } from "@/lib/export/schema.export";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  startTransition,
  useActionState,
  useEffect,
  Dispatch,
  SetStateAction,
  useEffectEvent,
} from "react";
import * as z from "zod";
import { ExportCategories } from "@/lib/types/general";
import { exportTable } from "@/lib/export/export";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function IsActiveForm({
  category,
  id,
  setModalOpen,
}: {
  category: ExportCategories;
  id?: string;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [exportResponse, exportAction, isPendingExport] = useActionState(
    exportTable,
    null,
  );
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(IsActiveFormSchema),
    defaultValues: {
      isActive: "all",
    },
    mode: "all",
  });
  const closeModal = useEffectEvent(() => {
    setModalOpen(false);
  });
  const onSubmit: SubmitHandler<z.infer<typeof IsActiveFormSchema>> = (
    data,
  ) => {
    const isActive =
      data.isActive === "true"
        ? true
        : data.isActive === "false"
          ? false
          : undefined;
    startTransition(() => {
      exportAction({ category, isActive, id });
    });
  };
  useEffect(() => {
    if (!exportResponse) return;

    if (exportResponse.success && exportResponse.data) {
      const { fileName, base64Url } = exportResponse.data;
      const link = document.createElement("a");
      link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64Url}`;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(exportResponse.message);
      closeModal();
    } else toast.error(exportResponse.message);
  }, [exportResponse]);
  const items = [
    { label: "All", value: "all" },
    { label: "Active", value: "true" },
    { label: "Disabled", value: "false" },
  ];
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FieldGroup>
        <Field>
          <FieldLabel
            htmlFor="status"
            className="after:ml-0.5 after:text-red-500 after:content-['*']"
          >
            Status
          </FieldLabel>
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Select
                items={items}
                value={
                  field.value !== undefined ? String(field.value) : undefined
                }
                onValueChange={field.onChange}
              >
                <SelectTrigger className="text-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.isActive && (
            <FieldError>{errors.isActive.message}</FieldError>
          )}
        </Field>
      </FieldGroup>
      <DialogFooter>
        <DialogClose
          render={
            <Button
              variant="outline"
              disabled={isPendingExport}
              type="button"
              className="font-medium text-lg! rounded-mid px-5! py-1.5!"
            >
              Cancel
            </Button>
          }
        />

        <Button
          type="submit"
          disabled={!isValid || isPendingExport}
          variant="secondary"
          onClick={() => {}}
          className="text-background font-medium text-lg! rounded-mid w-30! py-1.5!"
        >
          {isPendingExport ? (
            <Loader2 className="animate-spin text-white size-3.5" />
          ) : (
            "Export"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
