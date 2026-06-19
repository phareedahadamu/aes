import { z } from "zod";
import { ExportCategories } from "../types/general";

const EXPORT_CATEGORIES_ARRAY = [
  "property-units",
  "wards",
  "streets-in-ward",
  "customers",
  "properties-for-customer",
  "properties",
  "payments-for-property",
  "payments",
  "staff",
  "invitations",
] as const satisfies readonly ExportCategories[];

type Check1 = [ExportCategories] extends [
  (typeof EXPORT_CATEGORIES_ARRAY)[number],
]
  ? true
  : never;
type Check2 = [(typeof EXPORT_CATEGORIES_ARRAY)[number]] extends [
  ExportCategories,
]
  ? true
  : never;
// eslint-disable-next-line
const _assertCoverage1: Check1 = true;
// eslint-disable-next-line
const _assertCoverage2: Check2 = true;

export const ExportSchema = z
  .object({
    id: z.string("Id must be a string").optional(),
    category: z.enum(EXPORT_CATEGORIES_ARRAY, {
      message: "Please select an export category.",
    }),
    isActive: z.boolean("isActive must be a boolean").optional(),
    isUsed: z.boolean("isUsed must be a boolean").optional(),
    isExpired: z.boolean("isExpired must be a boolean").optional(),
    startDate: z.coerce.date("Invalid Date").optional(),
    endDate: z.coerce.date("Invalid Date").optional(),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return data.endDate >= data.startDate;
    },
    {
      message: "End date cannot be earlier than the start date.",
      path: ["endDate"],
    },
  )
  .strict();

export const IsActiveFormSchema = z.object({
  isActive: z
    .enum(["all", "true", "false"], { message: "Invalid type for Status" })
    .default("all"),
});

export const IsUsedIsExpiredSchema = z.object({
  isUsed: z
    .enum(["all", "true", "false"], {
      message: "Invalid type for Usage Status",
    })
    .default("all"),
  isExpired: z
    .enum(["all", "true", "false"], {
      message: "Invalid type for Expiry Status",
    })
    .default("all"),
});

export const DateRangeSchema = z
  .object({
    dateRange: z
      .object({
        from: z.date("Start date is required"),
        to: z.date("End date is required"),
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.dateRange?.from || !data.dateRange.to) return true;
      return data.dateRange.to >= data.dateRange?.from;
    },
    {
      message: "End date cannot be earlier than the start date.",
      path: ["endDate"],
    },
  );
