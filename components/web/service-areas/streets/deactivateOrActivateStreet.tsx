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
import { Street } from "@/generated/prisma/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ALL_STREETS_QKEY } from "@/lib/constants/general";
import { activateOrDeactivateStreet } from "@/lib/dal/service-areas/streets/streetsActions";
export default function DeactivateOrActivateStreet({
  street,
  alertOpen,
  setAlertOpen,
}: {
  street: Street;
  setAlertOpen: Dispatch<SetStateAction<boolean>>;
  alertOpen: boolean;
}) {
  const queryClient = useQueryClient();
  const [response, dispatchAction, isPending] = useActionState(
    activateOrDeactivateStreet,
    null,
  );
  const type = street.isActive ? "deactivate" : "activate";
  const actionText = type === "activate" ? "Activate" : "Deactivate";
  const actionColor = type === "activate" ? "success" : "[#F29A04]";
  const actionIcon =
    type === "activate" ? (
      <CircleCheckBig className={`text-${actionColor}`} />
    ) : (
      <Ban className={`text-${actionColor}`} />
    );
  const name = street.code;
  const descriptionText =
    type === "activate"
      ? `This will activate all  properties in ${name}.`
      : `This will deactivate all properties in ${name}.`;

  const handleAction = useCallback(() => {
    startTransition(() =>
      dispatchAction({
        streetId: street.id,
        currentState: street.isActive,
      }),
    );
  }, [street, dispatchAction]);

  const closeModal = useEffectEvent(() => {
    queryClient.invalidateQueries({
      queryKey: [ALL_STREETS_QKEY],
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
            {actionText} Street?
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
