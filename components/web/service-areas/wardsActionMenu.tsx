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
import { Ward } from "@/generated/prisma/client";

type WardType = {
  streets: ({
    _count: {
      properties: number;
    };
  } & { id: string })[];
  _count: {
    streets: number;
  };
} & Ward;
export default function WardsActionMenu({
  disabled,
  setEditModalOpen,
  setChangeStatusOpen,
  setWard,
  ward,
}: {
  disabled: boolean;
  setEditModalOpen: Dispatch<SetStateAction<boolean>>;
  setChangeStatusOpen: Dispatch<SetStateAction<boolean>>;
  setWard: Dispatch<SetStateAction<WardType | null>>;
  ward: WardType;
}) {
  const type = ward.isActive ? "deactivate" : "activate";
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
              setWard(ward);
              setChangeStatusOpen(true);
            }}
          >
            {actionIcon} {actionText} {" Ward"}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className={` text-base text-chart-2`}
            disabled={disabled || !ward.isActive}
            onClick={() => {
              setWard(ward);
              setEditModalOpen(true);
            }}
          >
            <Pen className="text-inherit" /> Edit Ward
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
