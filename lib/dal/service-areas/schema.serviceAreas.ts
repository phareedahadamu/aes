import * as z from "zod";
import { PAGE_LIMITS } from "@/lib/constants/general";

const minLimit = PAGE_LIMITS.XS;
const maxLimit = PAGE_LIMITS.XL;
export const GetServiceAreasPayloadSchema = z
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

export const ActivateOrDeactivateWardPayloadSchema = z
  .object({
    wardId: z.string("Code is required").trim(),
    currentState: z.boolean("Current State is required"),
  })
  .strict();

export const AddEditWardSchema = z.object({
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
});

export const AddWardPayloadSchema = z
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
  })
  .strict();

export const EditWardPayloadSchema = z
  .object({
    wardId: z.string("Id is required").trim(),
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
  })
  .strict();

export const GetWardByIdPayloadSchema = z
  .object({
    wardId: z.string("Ward Id is required").trim(),
  })
  .strict();
