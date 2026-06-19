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
import { Ellipsis, Pen, Ban, CircleCheckBig } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Street } from "@/generated/prisma/client";

export default function StreetsActionMenu({
  disabled,
  setEditModalOpen,
  setChangeStatusOpen,
  setStreet,
  street,
}: {
  disabled: boolean;
  setEditModalOpen: Dispatch<SetStateAction<boolean>>;
  setChangeStatusOpen: Dispatch<SetStateAction<boolean>>;
  setStreet: Dispatch<SetStateAction<Street | null>>;
  street: Street;
}) {
  const type = street.isActive ? "deactivate" : "activate";
  const actionText = type === "activate" ? "Activate" : "Deactivate";
  const actionColor = type === "activate" ? "success" : "[#F29A04]";
  const actionIcon =
    type === "activate" ? (
      <CircleCheckBig className={`text-${actionColor}`} />
    ) : (
      <Ban className={`text-${actionColor}`} />
    );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" />}>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full p-2">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className={`text-base text-${actionColor}`}
            disabled={disabled}
            onClick={() => {
              setStreet(street);
              setChangeStatusOpen(true);
            }}
          >
            {actionIcon} {actionText} {" Street"}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className={` text-base text-chart-2`}
            disabled={disabled || !street.isActive}
            onClick={() => {
              setStreet(street);
              setEditModalOpen(true);
            }}
          >
            <Pen className="text-inherit" /> Edit Street
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
