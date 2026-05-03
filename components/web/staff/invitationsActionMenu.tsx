"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { Dispatch, SetStateAction, useMemo } from "react";
import { Invitation } from "@/generated/prisma/client";
import { Ban, CircleCheckBig } from "lucide-react";
export default function InvitationsActionMenu({
  setRevokeOpen,
  setReactivateOpen,
  setInvitation,
  invitation,
}: {
  setRevokeOpen: Dispatch<SetStateAction<boolean>>;
  setReactivateOpen: Dispatch<SetStateAction<boolean>>;
  setInvitation: Dispatch<SetStateAction<Invitation | null>>;
  invitation: Invitation;
}) {
  const isExpired = useMemo(() => {
    return new Date(invitation.expiresAt) < new Date();
  }, [invitation.expiresAt]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" />}>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full p-2">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="text-base text-destructive"
            disabled={invitation.used || isExpired}
            onClick={() => {
              setRevokeOpen(true);
              setInvitation(invitation);
            }}
          >
            <Ban className="text-inherit" /> Revoke Invite
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className={` text-success text-base`}
            disabled={!invitation.used && !isExpired}
            onClick={() => {
              setReactivateOpen(true);
              setInvitation(invitation);
            }}
          >
            <CircleCheckBig className="text-inherit" /> Reactivate Invite
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
