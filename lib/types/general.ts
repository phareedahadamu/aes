export interface IPagination {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}
export interface FilterGroup {
  group: string;
  param: string;
  allTag: string;
  items: { name: string; value: string; active: boolean }[];
}

export enum Tab {
  STAFF = "staff",
  INVITATIONS = "invitations",
}

export interface ExportFnReturn {
  success: boolean;
  message: string;
  data: {
    base64Url: string;
    fileName: string;
  };
}
type isActiveProp = {
  isActive?: boolean;
};
type invitationsProps = {
  isUsed?: boolean;
  isExpired: boolean;
};
export type ExportModalFilters<T extends ExportCategories> = T extends
  | "property-units"
  | "wards"
  | "properties"
  | "staff"
  ? isActiveProp
  : T extends "streets-in-ward"
    ? { wardId: string } & isActiveProp
    : T extends "properties-for-customer"
      ? { customerId: string } & isActiveProp
      : T extends "payments"
        ? DateProps
        : T extends "payments-for-customer"
          ? DateProps & { customerId: string }
          : T extends "invitations"
            ? invitationsProps
            : undefined;

interface DateRangeAvailableProps {
  startDate: Date | string;
  endDate: Date | string;
}
interface DateRangeUnavailableProps {
  startDate?: undefined;
  endDate?: undefined;
}
type DateProps = DateRangeAvailableProps | DateRangeUnavailableProps;
export type ExportCategories =
  | "property-units"
  | "wards"
  | "streets-in-ward"
  | "customers"
  | "properties-for-customer"
  | "properties"
  | "payments-for-property"
  | "payments"
  | "staff"
  | "invitations";

type ExportModalBase<T extends ExportCategories> = {
  title: string;
  category: T;
  disabled?: boolean;
};
type ExportModalOptions<T extends ExportCategories> = T extends
  | "properties-for-customer"
  | "payments-for-property"
  | "streets-in-ward"
  ? { id: string }
  : { id?: never };
export type ExportModalProps<T extends ExportCategories> = ExportModalBase<T> &
  ExportModalOptions<T>;

import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

export type TButtonVariant = VariantProps<typeof buttonVariants>["variant"];

interface Property {
  owner: {
    ownerId: string;
  };
  location: {
    wardId: string;
    streetId: string;
    plotNo: string;
  };
  units: {
    unitId: string;
    qty: number;
  }[];
}
