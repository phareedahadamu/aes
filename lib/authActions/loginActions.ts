"use server";

import { auth } from "../auth";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import {
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
} from "@/generated/prisma/internal/prismaNamespace";
import { LoginUserPayloadSchema } from "./schema.auth";
import { Logger } from "../classes";
import { sanitizePayload } from "../utils";
import { handlePrismaError } from "../errorHandlers";

export async function loginUser(
  _prevState: { success: boolean; message: string } | null,
  payload: {
    email: string;
    password: string;
  },
) {
  try {
    const parsed = sanitizePayload(payload, LoginUserPayloadSchema);
    const { email, password } = parsed;
    const data = await auth.api.signInEmail({
      body: {
        email: email,
        password: password,
      },
      returnHeaders: true,
      headers: await headers(),
    });
    if (!data || !data.response.user) {
      throw new Error("Failed to login user");
    }
    return { success: true, message: "User logged in successfully" };
  } catch (error) {
    Logger.error("Login Error:", error);
    if (
      error instanceof APIError &&
      error.cause === auth.$ERROR_CODES.INVALID_EMAIL_OR_PASSWORD
    ) {
      return { success: false, message: "Invalid email or password" };
    }
    if (
      error instanceof APIError &&
      error.cause === auth.$ERROR_CODES.USER_NOT_FOUND
    ) {
      return { success: false, message: "User not found" };
    }
    if (error instanceof APIError && error.status === "UNAUTHORIZED") {
      return { success: false, message: error.message };
    }
    const errorMsg =
      error instanceof APIError
        ? error.message
        : error instanceof PrismaClientKnownRequestError ||
            error instanceof PrismaClientInitializationError ||
            error instanceof PrismaClientValidationError
          ? handlePrismaError(error)
          : error instanceof Error
            ? error.message
            : "Failed to login user";
    return { success: false, message: errorMsg };
  }
}
