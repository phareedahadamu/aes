"use server";

import { auth } from "../auth";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { PrismaClientKnownRequestError } from "@/generated/prisma/internal/prismaNamespace";
import { retryQuery } from "../retryquery";
import { LoginUserPayloadSchema } from "./schema.auth";

export async function loginUser(
  _prevState: { success: boolean; message: string } | null,
  payload: {
    email: string;
    password: string;
  },
) {
  try {
    const parsed = LoginUserPayloadSchema.safeParse(payload);
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
    const { email, password } = parsed.data;
    const data = await retryQuery(async () =>
      auth.api.signInEmail({
        body: {
          email: email,
          password: password,
        },
        returnHeaders: true,
        headers: await headers(),
      }),
    );
    if (!data || !data.response.user) {
      throw new Error("Failed to login user");
    }
    if (data.response.user.isActive === false) {
      await auth.api.signOut();
      return { success: false, message: "User account is inactive" };
    }
    if (data.headers) {
      const newCookies = data.headers.getSetCookie().join("; ");
      const authHeaders = new Headers(await headers());
      authHeaders.set("cookie", newCookies);
      await auth.api.revokeOtherSessions({
        headers: authHeaders,
      });
    }
    return { success: true, message: "User logged in successfully" };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
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
            : "Failed to login user";
    return { success: false, message: errorMsg };
  }
}
