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
import { CircleCheckBig } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  startTransition,
  useCallback,
  useEffectEvent,
} from "react";
import { revokeInvitation } from "@/lib/dal/staff/staffAndInvitationActions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Invitation } from "@/generated/prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { ALL_INVITATIONS_QKEY } from "@/lib/constants/general";
export default function ReactivateInvitation({
  invitation,
  reactivateOpen,
  setReactivateOpen,
}: {
  invitation: Invitation;
  setReactivateOpen: Dispatch<SetStateAction<boolean>>;
  reactivateOpen: boolean;
}) {
  const queryClient = useQueryClient();
  const [response, dispatchAction, isPending] = useActionState(
    revokeInvitation,
    null,
  );

  const handleAction = useCallback(() => {
    startTransition(() =>
      dispatchAction({
        invitationId: invitation.id,
      }),
    );
  }, [invitation.id, dispatchAction]);

  const closeModal = useEffectEvent(() => {
    queryClient.invalidateQueries({
      queryKey: [ALL_INVITATIONS_QKEY],
    });
    setReactivateOpen(false);
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
    <AlertDialog open={reactivateOpen} onOpenChange={setReactivateOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <CircleCheckBig className="text-success" />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-xl">
            Reactivate this invitation?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            {`${invitation.email} would receive an email with an invite link to register
            for a new account`}
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
