"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateRangeSchema } from "@/lib/export/schema.export";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
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
import DatePickerWithRange from "../datePickerWithRange";

export default function DateRangeForm({
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
    resolver: zodResolver(DateRangeSchema),

    mode: "all",
  });
  const closeModal = useEffectEvent(() => {
    setModalOpen(false);
  });
  const onSubmit: SubmitHandler<z.infer<typeof DateRangeSchema>> = (data) => {
    const startDate = data.dateRange?.from;
    const endDate = data.dateRange?.to;
    startTransition(() => {
      exportAction({ category, id, startDate, endDate });
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
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FieldGroup>
        <Field className="mx-auto w-60">
          <FieldLabel htmlFor={"dateRange"}>Date Range</FieldLabel>
          <DatePickerWithRange control={control} name="dateRange" />
          {errors.dateRange && (
            <FieldError>{errors.dateRange.message}</FieldError>
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
