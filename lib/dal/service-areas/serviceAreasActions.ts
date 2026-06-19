"use server";

import { sanitizePayload } from "@/lib/utils";
import prisma from "@/lib/prisma";
import {
  ActivateOrDeactivateWardPayloadSchema,
  AddWardPayloadSchema,
  EditWardPayloadSchema,
} from "./schema.serviceAreas";
import { verifyAdminAccess } from "../accessControl";
import { Logger } from "@/lib/classes";
import { AppError } from "@/lib/classes";
import { handlePrismaError } from "@/lib/errorHandlers";
import { APIError } from "better-auth/api";

export async function activateOrDeactivateWard(
  _prevState: {
    success: boolean;
    message: string;
  } | null,
  payload: {
    wardId: string;
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
      ActivateOrDeactivateWardPayloadSchema,
    );

    await verifyAdminAccess();

    const { wardId, currentState } = parsed;

    const targetState = !currentState;

    const updatedWard = await prisma.ward.updateMany({
      where: { id: wardId },
      data: { isActive: targetState },
    });
    if (updatedWard.count < 1) {
      return {
        success: false,
        message: "Ward not found",
      };
    }
    const statusText = targetState ? "activated" : "disabled";
    return { success: true, message: `Ward ${statusText} successfully` };
  } catch (error) {
    Logger.error("Error getting updating ward:", error);
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

export async function addWard(
  _prevState: {
    success: boolean;
    message: string;
  } | null,
  payload: {
    name: string;
    code: string;
  },
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Check Payload
    const parsed = sanitizePayload(payload, AddWardPayloadSchema);

    await verifyAdminAccess();

    const { name, code } = parsed;

    const ward = await prisma.ward.create({
      data: { name, code },
    });
    if (!ward) {
      return {
        success: false,
        message: "Couldn't create ward",
      };
    }
    return { success: true, message: "Ward created successfully" };
  } catch (error) {
    Logger.error("Error getting creating Ward:", error);
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

export async function editWard(
  _prevState: {
    success: boolean;
    message: string;
  } | null,
  payload: {
    wardId: string;
    name: string;
    code: string;
  },
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Check Payload
    const parsed = sanitizePayload(payload, EditWardPayloadSchema);

    await verifyAdminAccess();

    const { wardId, name, code } = parsed;

    const update = await prisma.ward.updateMany({
      where: { id: wardId, isActive: true },
      data: { name, code },
    });
    if (update.count < 1) {
      return {
        success: false,
        message: "Ward not found, or it has been disabled.",
      };
    }
    return { success: true, message: "Ward updated successfully" };
  } catch (error) {
    Logger.error("Error getting updating ward:", error);
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
