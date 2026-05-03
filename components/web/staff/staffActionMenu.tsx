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
import { Dispatch, SetStateAction } from "react";
import { Ban, CircleCheckBig, RefreshCw } from "lucide-react";
import { User } from "@/lib/auth";

export default function StaffActionMenu({
  isActive,
  isAuthedStaff,
  setAlertOpen,
  setDialogOpen,
  setStaff,
  staff,
}: {
  isActive: boolean;
  isAuthedStaff: boolean;
  setAlertOpen: Dispatch<SetStateAction<boolean>>;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  setStaff: Dispatch<SetStateAction<User | null>>;
  staff: User | null;
}) {
  const type = isActive ? "deactivate" : "activate";
  const actionText = type === "activate" ? "Activate" : "Deactivate";
  const actionColor = type === "activate" ? "text-success" : "text-[#F29A04]";
  const actionIcon =
    type === "activate" ? (
      <CircleCheckBig className={actionColor + "text-base"} />
    ) : (
      <Ban className={actionColor + "text-base"} />
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" />}>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full p-2">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="text-base text-chart-2"
            disabled={isAuthedStaff}
            onClick={() => {
              setDialogOpen(true);
              setStaff(staff);
            }}
          >
            <RefreshCw className="text-inherit" /> Change role
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className={` ${actionColor} text-base`}
            disabled={isAuthedStaff}
            onClick={() => {
              setAlertOpen(true);
              setStaff(staff);
            }}
          >
            {actionIcon} {actionText} staff
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
