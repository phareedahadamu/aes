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
import { Unit } from "@/generated/prisma/client";

export default function PropertyUnitsActionMenu({
  disabled,
  setEditModalOpen,
  setChangeStatusOpen,
  setUnit,
  unit,
}: {
  disabled: boolean;
  setEditModalOpen: Dispatch<SetStateAction<boolean>>;
  setChangeStatusOpen: Dispatch<SetStateAction<boolean>>;
  setUnit: Dispatch<SetStateAction<Unit | null>>;
  unit: Unit;
}) {
  const type = unit.isActive ? "deactivate" : "activate";
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
              setUnit(unit);
              setChangeStatusOpen(true);
            }}
          >
            {actionIcon} {actionText} {" Unit"}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className={` text-base text-chart-2`}
            disabled={disabled || !unit.isActive}
            onClick={() => {
              setUnit(unit);
              setEditModalOpen(true);
            }}
          >
            <Pen className="text-inherit" /> Edit Unit
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
