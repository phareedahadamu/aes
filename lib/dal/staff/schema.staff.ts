import * as z from "zod";
import { Role } from "@/generated/prisma/enums";

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
