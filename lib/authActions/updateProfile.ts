"use server";
import { auth } from "../auth";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { retryQuery } from "../retryquery";
import {
  UpdateUserNamePayloadSchema,
  UpdatePasswordPayloadSchema,
} from "./schema.auth";
import { revalidatePath } from "next/cache";
import { PrismaClientKnownRequestError } from "@/generated/prisma/internal/prismaNamespace";
import { getAuthUser } from "../auth";

export async function upDateUserName(
  _prevState: { success: boolean; message: string } | null,
  payload: {
    name: string;
  },
) {
  try {
    const parsed = UpdateUserNamePayloadSchema.safeParse(payload);
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
    const { name } = parsed.data;
    const user = await getAuthUser();
    if (!user) {
      return {
        success: false,
        message: "Unauthorized. Sign In to update name",
      };
    }
    if (!user.isActive) {
      return {
        success: false,
        message: "Unauthorized. This is a disabled account.",
      };
    }
    const result = await retryQuery(async () =>
      auth.api.updateUser({
        body: { name },
        headers: await headers(),
      }),
    );
    if (!result.status) {
      return { success: false, message: "Failed to update name" };
    }
    revalidatePath("/(app)", "layout");
    return { success: true, message: "Name successfully updated" };
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
      return { success: false, message: "Database connection timed out" };
    }
    const errorMsg =
      error instanceof APIError
        ? error.message
        : error instanceof PrismaClientKnownRequestError
          ? "Database error: " + error.code
          : error instanceof Error
            ? error.message
            : "Failed to update name.";
    return { success: false, message: errorMsg };
  }
}

export async function upDatePassword(
  _prevState: { success: boolean; message: string } | null,
  payload: {
    currentPassword: string;
    newPassword: string;
  },
) {
  try {
    const parsed = UpdatePasswordPayloadSchema.safeParse(payload);
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
    const { currentPassword, newPassword } = parsed.data;
    const user = await getAuthUser();
    if (!user) {
      return {
        success: false,
        message: "Unauthorized. Sign In to update password",
      };
    }
    if (!user.isActive) {
      return {
        success: false,
        message: "Unauthorized. This is a disabled account.",
      };
    }
    const result = await retryQuery(async () =>
      auth.api.changePassword({
        body: {
          newPassword: newPassword,
          currentPassword: currentPassword,
        },
        headers: await headers(),
      }),
    );
    if (!result || !result.user) {
      return { success: false, message: "Failed to update password" };
    }
    revalidatePath("/(app)", "layout");
    return { success: true, message: "Password successfully updated" };
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
      return { success: false, message: "Database connection timed out" };
    }
    const errorMsg =
      error instanceof APIError
        ? error.message
        : error instanceof PrismaClientKnownRequestError
          ? "Database error: " + error.code
          : error instanceof Error
            ? error.message
            : "Failed to update password.";
    return { success: false, message: errorMsg };
  }
}
