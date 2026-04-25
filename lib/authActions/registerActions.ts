"use server";

import prisma from "../prisma";
import { PrismaClientKnownRequestError } from "@/generated/prisma/internal/prismaNamespace";
import { Invitation } from "@/generated/prisma/client";
import { auth } from "../auth";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { retryQuery } from "../retryquery";
import { RegisterUserPayloadSchema } from "./schema.auth";

export async function verifyToken(token: string): Promise<{
  success: boolean;
  invitation: Pick<Invitation, "email" | "role"> | null;
  message: string;
}> {
  try {
    const tokenRecord = await retryQuery(() =>
      prisma.invitation.findUnique({
        where: { token },
      }),
    );
    if (!tokenRecord) {
      throw new Error("Invalid token");
    }
    if (tokenRecord.used) {
      throw new Error("Token already used");
    }
    const expiresAtDate =
      tokenRecord.expiresAt instanceof Date
        ? tokenRecord.expiresAt
        : new Date(tokenRecord.expiresAt);
    if (expiresAtDate < new Date()) {
      throw new Error("Token expired");
    }
    return {
      success: true,
      invitation: {
        email: tokenRecord.email,
        role: tokenRecord.role,
      },
      message: "Token is valid",
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
      throw new Error("Connection Timed out", { cause: "Connection error" });
    }
    const errorMsg =
      error instanceof PrismaClientKnownRequestError
        ? "Database error: " + error.code
        : error instanceof Error
          ? error.message
          : "Something went wrong";
    return { success: false, invitation: null, message: errorMsg };
  }
}

export async function registerUser(
  _prevState: { success: boolean; message: string } | null,
  payload: {
    token: string;
    password: string;
    name: string;
  },
) {
  try {
    const parsed = RegisterUserPayloadSchema.safeParse(payload);
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
    const { name, password, token } = parsed.data;

    const invitation = await retryQuery(() =>
      prisma.invitation.findUnique({
        where: { token },
      }),
    );
    if (!invitation) {
      return {
        success: false,
        message: "Invalid token",
      };
    }
    if (invitation.used) {
      return {
        success: false,
        message: "Token already used",
      };
    }
    const expiresAtDate =
      invitation.expiresAt instanceof Date
        ? invitation.expiresAt
        : new Date(invitation.expiresAt);
    if (expiresAtDate < new Date()) {
      return {
        success: false,
        message: "Token is expired",
      };
    }
    const { email, role, id } = invitation;
    if (!name || !password || !email || !role) {
      return { success: false, message: "Missing required fields" };
    }
    const result = await retryQuery(() =>
      prisma.invitation.updateMany({
        where: { id: id, used: false },
        data: { used: true },
      }),
    );
    if (!result || result.count === 0) {
      return { success: false, message: "Invalid or already used invitation" };
    }
    try {
      const data = await retryQuery(async () =>
        auth.api.signUpEmail({
          body: {
            name: name,
            email: email,
            password: password,
            role: role,
          },
          headers: await headers(),
        }),
      );
      if (!data || !data.user) {
        throw new Error("Failed to create user");
      }
    } catch (err) {
      await retryQuery(() =>
        prisma.invitation.updateMany({
          where: { id: id, used: true },
          data: { used: false },
        }),
      );
      throw err;
    }
    return { success: true, message: "User registered successfully" };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
    if (
      error instanceof APIError &&
      error.cause === auth.$ERROR_CODES.USER_ALREADY_EXISTS
    ) {
      return { success: false, message: "User already exists" };
    }
    if (
      error instanceof APIError &&
      error.cause === auth.$ERROR_CODES.FAILED_TO_CREATE_USER
    ) {
      return { success: false, message: "Failed to create user" };
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
            : "Failed to register user";
    return { success: false, message: errorMsg };
  }
}
