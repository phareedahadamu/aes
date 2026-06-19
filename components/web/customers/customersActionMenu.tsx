"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Pen } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Customer } from "@/generated/prisma/client";

type CustomerType = {
  properties: {
    id: string;
    balance: number;
  }[];
  _count: {
    properties: number;
  };
} & Customer;
export default function CustomerActionMenu({
  disabled,
  setEditModalOpen,
  setCustomer,
  customer,
}: {
  disabled: boolean;
  setEditModalOpen: Dispatch<SetStateAction<boolean>>;
  setCustomer: Dispatch<SetStateAction<CustomerType | null>>;
  customer: CustomerType;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" />}>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full p-2">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className={` text-base text-chart-2`}
            disabled={disabled}
            onClick={() => {
              setCustomer(customer);
              setEditModalOpen(true);
            }}
          >
            <Pen className="text-inherit" /> Edit Customer
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
