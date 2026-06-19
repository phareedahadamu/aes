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
import { Ward } from "@/generated/prisma/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  ALL_SERVICE_AREAS_QKEY,
  SERVICE_AREAS_METRICS_QKEY,
} from "@/lib/constants/general";
import { activateOrDeactivateWard } from "@/lib/dal/service-areas/serviceAreasActions";
export default function DeactivateOrActivateWard({
  ward,
  alertOpen,
  setAlertOpen,
}: {
  ward: Ward;
  setAlertOpen: Dispatch<SetStateAction<boolean>>;
  alertOpen: boolean;
}) {
  const queryClient = useQueryClient();
  const [response, dispatchAction, isPending] = useActionState(
    activateOrDeactivateWard,
    null,
  );
  const type = ward.isActive ? "deactivate" : "activate";
  const actionText = type === "activate" ? "Activate" : "Deactivate";
  const actionColor = type === "activate" ? "success" : "[#F29A04]";
  const actionIcon =
    type === "activate" ? (
      <CircleCheckBig className={`text-${actionColor}`} />
    ) : (
      <Ban className={`text-${actionColor}`} />
    );
  const name = ward.code;
  const descriptionText =
    type === "activate"
      ? `This will activate all streets and properties in ${name}.`
      : `This will deactivate all streets and properties in ${name}.`;

  const handleAction = useCallback(() => {
    startTransition(() =>
      dispatchAction({
        wardId: ward.id,
        currentState: ward.isActive,
      }),
    );
  }, [ward, dispatchAction]);

  const closeModal = useEffectEvent(() => {
    queryClient.invalidateQueries({
      queryKey: [ALL_SERVICE_AREAS_QKEY],
    });
    queryClient.invalidateQueries({
      queryKey: [SERVICE_AREAS_METRICS_QKEY],
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
            {actionText} Ward?
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
