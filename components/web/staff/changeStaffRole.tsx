"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { User } from "@/lib/auth";
import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import StatusRolePill from "../statusRolePill";
import { Role } from "@/generated/prisma/enums";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { normalizeText } from "@/lib/utils";
import { toast } from "sonner";
import {
  useActionState,
  useEffect,
  useCallback,
  startTransition,
  useEffectEvent,
} from "react";
import { changeStaffRole } from "@/lib/dal/staff/staffAndInvitationActions";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { ALL_STAFF_QKEY } from "@/lib/constants/general";

export default function ChangeStaffRole({
  staff,
  setDialogOpen,
  dialogOpen,
}: {
  staff: User;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  dialogOpen: boolean;
}) {
  const queryClient = useQueryClient();
  const [response, dispatchAction, isPending] = useActionState(
    changeStaffRole,
    null,
  );
  const roles = Object.values(Role).map((role) => ({
    label: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(),
    value: role,
  }));

  const handleSubmit = useCallback(
    (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const role = formData.get("role") as Role;
      console.log(role);
      startTransition(() =>
        dispatchAction({
          staffId: staff.id,
          role: role,
        }),
      );
    },
    [staff.id, dispatchAction],
  );

  const closeModal = useEffectEvent(() => {
    queryClient.invalidateQueries({
      queryKey: [ALL_STAFF_QKEY],
    });
    setDialogOpen(false);
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
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="max-w-lg! px-4! py-6.5! ">
        <DialogHeader className="gap-6!">
          <DialogTitle>Change Staff Role</DialogTitle>
          <hr />
          <DialogDescription className="w-full flex gap-2 py-1.75 px-4 rounded-mid bg-[#F1F1F1] items-center text-foreground">
            <span className="rounded-full border border-secondary size-16 leading-16 font-medium text-2xl text-center">
              {staff.name[0].toUpperCase()}
            </span>
            <span className="flex flex-col gap-2 text-left mr-2">
              <span className=" font-medium text-2xl">
                {normalizeText(staff.name)}
              </span>
              <span className="text-lg text-muted-foreground font-regular">
                {staff.email}
              </span>
            </span>
            <StatusRolePill role={staff.role} type={"role"} />
          </DialogDescription>
        </DialogHeader>
        <form className="gap-6 flex flex-col" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="role">Assign new role</FieldLabel>
              <Select items={roles} defaultValue={staff.role} name="role">
                <SelectTrigger className="w-full h-12!">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose
              render={
                <Button
                  variant="outline"
                  className="font-medium text-lg px-2.5 py-1.5 min-w-25"
                  disabled={isPending}
                >
                  Cancel
                </Button>
              }
            />
            <Button
              type="submit"
              variant="secondary"
              className="text-background text-lg px-2.5 py-1.5 font-medium min-w-30.5 text-center"
            >
              {isPending ? (
                <Loader2 className="animate-spin text-background" />
              ) : (
                "Confirm Change"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
