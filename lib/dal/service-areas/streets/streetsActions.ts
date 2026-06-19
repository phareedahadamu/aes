"use server";

import { sanitizePayload } from "@/lib/utils";
import prisma from "@/lib/prisma";
import {
  ActivateOrDeactivateStreetPayloadSchema,
  AddStreetPayloadSchema,
  EditStreetPayloadSchema,
} from "./schema.streets";
import { verifyAdminAccess } from "../../accessControl";
import { Logger } from "@/lib/classes";
import { AppError } from "@/lib/classes";
import { handlePrismaError } from "@/lib/errorHandlers";
import { APIError } from "better-auth/api";

export async function activateOrDeactivateStreet(
  _prevState: {
    success: boolean;
    message: string;
  } | null,
  payload: {
    streetId: string;
    currentState: boolean;
  },
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Check Payload
    const parsed = sanitizePayload(
      payload,
      ActivateOrDeactivateStreetPayloadSchema,
    );

    await verifyAdminAccess();

    const { streetId, currentState } = parsed;

    const targetState = !currentState;

    const updatedStreet = await prisma.street.updateMany({
      where: { id: streetId },
      data: { isActive: targetState },
    });
    if (updatedStreet.count < 1) {
      return {
        success: false,
        message: "Street not found",
      };
    }
    const statusText = targetState ? "activated" : "disabled";
    return { success: true, message: `Street ${statusText} successfully` };
  } catch (error) {
    Logger.error("Error getting updating street:", error);
    const message =
      error instanceof AppError
        ? error.message
        : error instanceof APIError
          ? "Authentication service is currently unavailable."
          : handlePrismaError(error);
    return {
      success: false,
      message: message,
    };
  }
}

export async function addStreet(
  _prevState: {
    success: boolean;
    message: string;
  } | null,
  payload: {
    name: string;
    code: string;
    wardId: string;
  },
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Check Payload
    const parsed = sanitizePayload(payload, AddStreetPayloadSchema);

    await verifyAdminAccess();

    const { name, code, wardId } = parsed;

    const street = await prisma.street.create({
      data: { name, code, wardId },
    });
    if (!street) {
      return {
        success: false,
        message: "Couldn't create street",
      };
    }
    return { success: true, message: "Street created successfully" };
  } catch (error) {
    Logger.error("Error getting creating Street:", error);
    const message =
      error instanceof AppError
        ? error.message
        : error instanceof APIError
          ? "Authentication service is currently unavailable."
          : handlePrismaError(error);
    return {
      success: false,
      message: message,
    };
  }
}

export async function editStreet(
  _prevState: {
    success: boolean;
    message: string;
  } | null,
  payload: {
    streetId: string;
    name: string;
    code: string;
  },
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Check Payload
    const parsed = sanitizePayload(payload, EditStreetPayloadSchema);

    await verifyAdminAccess();

    const { streetId, name, code } = parsed;

    const update = await prisma.street.updateMany({
      where: { id: streetId, isActive: true },
      data: { name, code },
    });
    if (update.count < 1) {
      return {
        success: false,
        message: "Street not found, or has been disabled.",
      };
    }
    return { success: true, message: "Street updated successfully" };
  } catch (error) {
    Logger.error("Error getting updating street:", error);
    const message =
      error instanceof AppError
        ? error.message
        : error instanceof APIError
          ? "Authentication service is currently unavailable."
          : handlePrismaError(error);
    return {
      success: false,
      message: message,
    };
  }
}
