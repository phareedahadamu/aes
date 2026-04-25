"use server";
import { Role } from "@/generated/prisma/enums";
import { getAuthUser } from "@/lib/auth";
import { InviteStaffPayloadSchema } from "./schema.staff";
import { randomBytes } from "crypto";
import prisma from "@/lib/prisma";
import { retryQuery } from "@/lib/retryquery";
import { PrismaClientKnownRequestError } from "@/generated/prisma/internal/prismaNamespace";
import { sendSingleEmail } from "@/lib/resend";

export async function sendStaffInvite(
  _prevState: {
    success: boolean;
    data: { message: string; isDuplicate: boolean };
  } | null,
  payload: {
    email: string;
    role: Role;
  },
): Promise<{
  success: boolean;
  data: { isDuplicate: boolean; message: string };
}> {
  try {
    // Check Payload
    const parsed = InviteStaffPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      const messages = parsed.error.issues.map((issue) => {
        if (issue.code === "unrecognized_keys") {
          return `Extra fields not allowed: ${issue.keys.join(", ")}`;
        }
        return issue.message;
      });

      return {
        success: false,
        data: {
          message: "Invalid input: " + messages.join("; "),
          isDuplicate: false,
        },
      };
    }

    // Check if user has access
    const user = await getAuthUser();
    if (!user) {
      return {
        success: false,
        data: {
          message: "Unauthorized. Sign in to invite staff.",
          isDuplicate: false,
        },
      };
    }
    if (!user.isActive) {
      return {
        success: false,
        data: {
          message: "Unauthorized. Disabled account.",
          isDuplicate: false,
        },
      };
    }
    if (user.role !== Role.ADMIN) {
      return {
        success: false,
        data: {
          message: "Unauthorized. Must be an admin to invite a user.",
          isDuplicate: false,
        },
      };
    }
    const { email, role } = parsed.data;
    if (!user.isSuperAdmin && role === Role.ADMIN) {
      return {
        success: false,
        data: {
          message: "Unauthorized. Only the super admin can invite new admins.",
          isDuplicate: false,
        },
      };
    }

    // Check if staff is already registered
    const emailExists = await retryQuery(() =>
      prisma.user.findUnique({ where: { email } }),
    );
    if (emailExists) {
      return {
        success: false,
        data: {
          message: "A staff with this email is already registered.",
          isDuplicate: false,
        },
      };
    }

    // Check if a valid invitation exists
    const inviteExists = await retryQuery(() =>
      prisma.invitation.findUnique({
        where: { email },
      }),
    );
    if (
      inviteExists &&
      !inviteExists.used &&
      inviteExists.expiresAt > new Date()
    ) {
      return {
        success: false,
        data: {
          message: "Valid invitation exists for this email.",
          isDuplicate: false,
        },
      };
    }

    // Check if expired or used invitation exists
    if (
      inviteExists &&
      (inviteExists.used || inviteExists.expiresAt <= new Date())
    ) {
      return {
        success: false,
        data: {
          message:
            "Expired or used invitation exists for this email. Resend invitation instead",
          isDuplicate: true,
        },
      };
    }

    // Create new invitation and send email
    const token = randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const invitation = await retryQuery(() =>
      prisma.invitation.create({ data: { email, role, token, expiresAt } }),
    );
    if (!invitation) {
      return {
        success: false,
        data: { message: "Couldn't create invitation", isDuplicate: false },
      };
    }
    const link = process.env.NEXT_PUBLIC_URL + "/register?token=" + token;

    let emailResult;

    try {
      emailResult = await sendSingleEmail({
        link,
        email,
        idempotencyKey: invitation.id,
      });
    } catch (err) {
      console.error(err);
      await retryQuery(() =>
        prisma.invitation.delete({ where: { id: invitation.id } }),
      );
      return {
        success: false,
        data: {
          message: "Email delivery failed. Please try again.",
          isDuplicate: false,
        },
      };
    }
    if (!emailResult) {
      await retryQuery(() =>
        prisma.invitation.delete({ where: { id: invitation.id } }),
      );
      return {
        success: false,
        data: { message: "Couldn't send email", isDuplicate: false },
      };
    }
    return {
      success: true,
      data: { message: "Invitation sent successfully.", isDuplicate: false },
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
    if (
      error instanceof PrismaClientKnownRequestError &&
      (error.code === "ENETUNREACH" ||
        error.code === "ETIMEDOUT" ||
        error.code === "P1001")
    ) {
      return {
        success: false,
        data: { message: "Database connection timed out", isDuplicate: false },
      };
    }
    const errorMsg =
      error instanceof PrismaClientKnownRequestError
        ? "Database error: " + error.code
        : error instanceof Error
          ? error.message
          : "Failed to send invitation";
    return { success: false, data: { message: errorMsg, isDuplicate: false } };
  }
}

export async function resendStaffInvite(
  _prevState: {
    success: boolean;
    message: string;
  } | null,
  payload: {
    email: string;
    role: Role;
  },
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Check Payload
    const parsed = InviteStaffPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      const messages = parsed.error.issues.map((issue) => {
        if (issue.code === "unrecognized_keys") {
          return `Extra fields not allowed: ${issue.keys.join(", ")}`;
        }
        return issue.message;
      });

      return {
        success: false,
        message: "Invalid input: " + messages.join("; "),
      };
    }

    // Check if user has access
    const user = await getAuthUser();
    if (!user) {
      return {
        success: false,
        message: "Unauthorized. Sign in to invite staff.",
      };
    }
    if (!user.isActive) {
      return {
        success: false,
        message: "Unauthorized. Disabled account.",
      };
    }
    if (user.role !== Role.ADMIN) {
      return {
        success: false,
        message: "Unauthorized. Must be an admin to invite a user.",
      };
    }
    const { email, role } = parsed.data;
    if (!user.isSuperAdmin && role === Role.ADMIN) {
      return {
        success: false,
        message: "Unauthorized. Only the super admin can invite new admins.",
      };
    }

    // Check if staff is already registered
    const emailExists = await retryQuery(() =>
      prisma.user.findUnique({ where: { email } }),
    );
    if (emailExists) {
      return {
        success: false,
        message: "A staff with this email is already registered.",
      };
    }

    // Check if an invitation exists
    const inviteExists = await retryQuery(() =>
      prisma.invitation.findUnique({
        where: { email },
      }),
    );
    if (!inviteExists) {
      return {
        success: false,
        message:
          "No invitation found for this email. Send a new invitation instead.",
      };
    }

    // Check if a valid invitation exists
    if (
      inviteExists &&
      !inviteExists.used &&
      inviteExists.expiresAt > new Date()
    ) {
      return {
        success: false,
        message: "Valid invitation exists for this email.",
      };
    }

    // Update invitation and send email
    const token = randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const invitation = await retryQuery(() =>
      prisma.invitation.update({
        where: { email },
        data: { role, token, expiresAt, isUsed: false },
      }),
    );
    if (!invitation) {
      return {
        success: false,
        message: "Couldn't update invitation",
      };
    }
    const link = process.env.NEXT_PUBLIC_URL + "/register?token=" + token;

    let emailResult;

    try {
      emailResult = await sendSingleEmail({
        link,
        email,
        idempotencyKey: invitation.id,
      });
    } catch (err) {
      console.error(err);
      await retryQuery(() =>
        prisma.invitation.delete({ where: { id: invitation.id } }),
      );
      return {
        success: false,
        message: "Email delivery failed. Please try again.",
      };
    }
    if (!emailResult) {
      await retryQuery(() =>
        prisma.invitation.delete({ where: { id: invitation.id } }),
      );
      return {
        success: false,
        message: "Couldn't send email",
      };
    }
    return {
      success: true,
      message: "Invitation sent successfully.",
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
    if (
      error instanceof PrismaClientKnownRequestError &&
      (error.code === "ENETUNREACH" ||
        error.code === "ETIMEDOUT" ||
        error.code === "P1001")
    ) {
      return {
        success: false,
        message: "Database connection timed out",
      };
    }
    const errorMsg =
      error instanceof PrismaClientKnownRequestError
        ? "Database error: " + error.code
        : error instanceof Error
          ? error.message
          : "Failed to send invitation";
    return { success: false, message: errorMsg };
  }
}
