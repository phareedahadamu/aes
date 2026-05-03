import * as z from "zod";
import { Role } from "@/generated/prisma/enums";
import { PAGE_LIMITS } from "@/lib/constants/general";

export const InviteStaffSchema = z.object({
  email: z.email("Invalid email address"),
  role: z.enum(Role, "Role is required"),
});

export const InviteStaffPayloadSchema = z
  .object({
    email: z.email("Invalid email address"),
    role: z.enum(Role, "Role is required"),
  })
  .strict();

const minLimit = PAGE_LIMITS.XS;
const maxLimit = PAGE_LIMITS.XL;

export const GetStaffPayloadSchema = z
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
    emailQuery: z
      .string("Invalid type for email")
      .trim()
      .toLowerCase()
      .optional(),
    role: z.enum(Role, "Invalid role type").optional(),
    isActive: z.coerce.boolean().optional(),
  })
  .strict();

export const GetInvitationsPayloadSchema = z
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
    emailQuery: z
      .string("Invalid type for email")
      .trim()
      .toLowerCase()
      .optional(),
    isUsed: z.coerce.boolean().optional(),
    isExpired: z.coerce.boolean().optional(),
  })
  .strict();

export const ActivateOrDeactivateStaffPayloadSchema = z
  .object({
    staffId: z.string("Staff ID must be a string"),
  })
  .strict();

export const ChangeStaffRolePayloadSchema = z
  .object({
    staffId: z.string("Staff ID must be a string"),
    role: z.enum(Role, "Role is required"),
  })
  .strict();

export const RevokeReactivateInvitationPayloadSchema = z
  .object({
    invitationId: z.string("Staff ID must be a string"),
  })
  .strict();
