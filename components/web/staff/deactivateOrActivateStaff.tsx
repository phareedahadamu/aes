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
import { User } from "@/lib/auth";
import { activateOrDeactivateStaff } from "@/lib/dal/staff/staffAndInvitationActions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { normalizeText } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { ALL_STAFF_QKEY } from "@/lib/constants/general";
export default function DeactivateOrActivateStaff({
  staff,
  alertOpen,
  setAlertOpen,
}: {
  staff: User;
  setAlertOpen: Dispatch<SetStateAction<boolean>>;
  alertOpen: boolean;
}) {
  const queryClient = useQueryClient();
  const [response, dispatchAction, isPending] = useActionState(
    activateOrDeactivateStaff,
    null,
  );
  const type = staff.isActive ? "deactivate" : "activate";
  const actionText = type === "activate" ? "Activate" : "Deactivate";
  const actionColor = type === "activate" ? "success" : "[#F29A04]";
  const actionIcon =
    type === "activate" ? (
      <CircleCheckBig className={`text-${actionColor}`} />
    ) : (
      <Ban className={`text-${actionColor}`} />
    );
  const name = staff.name ? normalizeText(staff.name) : "Staff member";
  const descriptionText =
    type === "activate"
      ? `This will enable  ${name} to access their account and perform actions based on their role.`
      : `This will disable ${name}'s access to their account and prevent them from performing any actions.`;

  const handleAction = useCallback(() => {
    startTransition(() =>
      dispatchAction({
        staffId: staff.id,
      }),
    );
  }, [staff, dispatchAction]);

  const closeModal = useEffectEvent(() => {
    queryClient.invalidateQueries({
      queryKey: [ALL_STAFF_QKEY],
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
            {actionText} Staff Member?
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
