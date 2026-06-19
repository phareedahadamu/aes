"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogMedia,
} from "@/components/ui/alert-dialog";
import { Ban, CircleCheckBig } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  startTransition,
  useCallback,
  useEffectEvent,
} from "react";
import { Unit } from "@/generated/prisma/client";
import { activateOrDeactivatePropertyUnit } from "@/lib/dal/property-units/propertyUnitsActions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  ALL_PROPERTY_UNITS_QKEY,
  PROPERTY_UNITS_METRICS_QKEY,
} from "@/lib/constants/general";
export default function DeactivateOrActivatePropertyUnit({
  unit,
  alertOpen,
  setAlertOpen,
}: {
  unit: Unit;
  setAlertOpen: Dispatch<SetStateAction<boolean>>;
  alertOpen: boolean;
}) {
  const queryClient = useQueryClient();
  const [response, dispatchAction, isPending] = useActionState(
    activateOrDeactivatePropertyUnit,
    null,
  );
  const type = unit.isActive ? "deactivate" : "activate";
  const actionText = type === "activate" ? "Activate" : "Deactivate";
  const actionColor = type === "activate" ? "success" : "[#F29A04]";
  const actionIcon =
    type === "activate" ? (
      <CircleCheckBig className={`text-${actionColor}`} />
    ) : (
      <Ban className={`text-${actionColor}`} />
    );
  const name = unit.code;
  const descriptionText =
    type === "activate"
      ? `This will enable  ${name} to be used in property compositions`
      : `This will disable ${name} from being used in property compositions.`;

  const handleAction = useCallback(() => {
    startTransition(() =>
      dispatchAction({
        unitId: unit.id,
        currentState: unit.isActive,
      }),
    );
  }, [unit, dispatchAction]);

  const closeModal = useEffectEvent(() => {
    queryClient.invalidateQueries({
      queryKey: [ALL_PROPERTY_UNITS_QKEY],
    });
    queryClient.invalidateQueries({
      queryKey: [PROPERTY_UNITS_METRICS_QKEY],
    });
    setAlertOpen(false);
  });

  useEffect(() => {
    if (response) {
      if (response.success) {
        closeModal();
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    }
  }, [response]);
  return (
    <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>{actionIcon}</AlertDialogMedia>
          <AlertDialogTitle className="text-xl">
            {actionText} Property Unit?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            {descriptionText}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={() => {
              handleAction();
            }}
          >
            {isPending ? (
              <Loader2 className="text-background size-6! animate-spin" />
            ) : (
              "Continue"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
