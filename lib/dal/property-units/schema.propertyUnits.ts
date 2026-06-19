import * as z from "zod";
import { PAGE_LIMITS } from "@/lib/constants/general";

const minLimit = PAGE_LIMITS.XS;
const maxLimit = PAGE_LIMITS.XL;
export const GetPropertyUnitsPayloadSchema = z
  .object({
    page: z.coerce
      .number("Page must be a number")
      .int("Page must be an integer")
      .positive("Page must be a positive number")
      .default(1),
    limit: z.coerce
      .number("Limit must be a number")
      .int("Limit must be an integer")
      .min(minLimit, `Limit cannot be less than  ${minLimit}`)
      .max(maxLimit, `Limit cannot exceed 5 ${maxLimit}`)
      .default(minLimit),
    searchQuery: z
      .string("Please provide search query")
      .trim()
      .toLowerCase()
      .optional(),
    isActive: z.coerce.boolean().optional(),
  })
  .strict();

export const AddEditPropertyUnitSchema = z.object({
  code: z
    .string("Code is required")
    .trim()
    .min(3, "Code must be at least 3 characters")
    .max(9, "Code cannot exceed 9 characters"),
  name: z
    .string("Name is required")
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(256, "Name cannot exceed 256 characters"),
  price: z.coerce
    .number("Price is required")
    .nonnegative("Price cannot be a negative number")
    .min(1, "Price cannot be 0"),
});

export const AddPropertyPayloadUnitSchema = z
  .object({
    code: z
      .string("Code is required")
      .trim()
      .min(3, "Code must be at least 3 characters")
      .max(9, "Code cannot exceed 9 characters"),
    name: z
      .string("Name is required")
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(256, "Name cannot exceed 256 characters"),
    price: z.coerce
      .number("Price is required")
      .nonnegative("Price cannot be a negative number"),
  })
  .strict();

export const EditPropertyPayloadUnitSchema = z
  .object({
    unitId: z.string("Id is required").trim(),
    code: z
      .string("Code is required")
      .trim()
      .min(3, "Code must be at least 3 characters")
      .max(9, "Code cannot exceed 9 characters"),
    name: z
      .string("Name is required")
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(256, "Name cannot exceed 256 characters"),
    price: z.coerce
      .number("Price is required")
      .nonnegative("Price cannot be a negative number"),
  })
  .strict();

export const ActivateOrDeactivatePropertyUnitPayloadSchema = z
  .object({
    unitId: z.string("Code is required").trim(),
    currentState: z.boolean("Current state is required"),
  })
  .strict();
