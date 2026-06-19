"use server";

import { sanitizePayload } from "@/lib/utils";
import prisma from "@/lib/prisma";
import {
  AddPropertyPayloadUnitSchema,
  EditPropertyPayloadUnitSchema,
  ActivateOrDeactivatePropertyUnitPayloadSchema,
} from "./schema.propertyUnits";
import { verifyAdminAccess } from "../accessControl";
import { Logger } from "@/lib/classes";
import { AppError } from "@/lib/classes";
import { handlePrismaError } from "@/lib/errorHandlers";
import { APIError } from "better-auth/api";

export async function addPropertyUnit(
  _prevState: {
    success: boolean;
    message: string;
  } | null,
  payload: {
    name: string;
    code: string;
    price: number;
  },
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Check Payload
    const parsed = sanitizePayload(payload, AddPropertyPayloadUnitSchema);

    await verifyAdminAccess();

    const { name, code, price } = parsed;

    const unit = await prisma.unit.create({
      data: { name, code, price },
    });
    if (!unit) {
      return {
        success: false,
        message: "Couldn't create property unit",
      };
    }
    return { success: true, message: "Property unit created successfully" };
  } catch (error) {
    Logger.error("Error getting creating Property Unit:", error);
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

export async function editPropertyUnit(
  _prevState: {
    success: boolean;
    message: string;
  } | null,
  payload: {
    unitId: string;
    name: string;
    code: string;
    price: number;
  },
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Check Payload
    const parsed = sanitizePayload(payload, EditPropertyPayloadUnitSchema);

    await verifyAdminAccess();

    const { unitId, name, code, price } = parsed;

    const update = await prisma.unit.updateMany({
      where: { id: unitId, isActive: true },
      data: { name, code, price },
    });
    if (update.count < 1) {
      return {
        success: false,
        message: "Property unit not found or has been disabled",
      };
    }
    return { success: true, message: "Property unit updated successfully" };
  } catch (error) {
    Logger.error("Error getting updating property unit:", error);
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

export async function activateOrDeactivatePropertyUnit(
  _prevState: {
    success: boolean;
    message: string;
  } | null,
  payload: {
    unitId: string;
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
      ActivateOrDeactivatePropertyUnitPayloadSchema,
    );

    await verifyAdminAccess();

    const { unitId, currentState } = parsed;
    const targetState = !currentState;

    const updatedUnit = await prisma.unit.updateMany({
      where: { id: unitId },
      data: { isActive: targetState },
    });
    if (updatedUnit.count < 1) {
      return {
        success: false,
        message: "Property unit not found",
      };
    }
    const statusText = targetState ? "activated" : "disabled";
    return {
      success: true,
      message: `Property unit ${statusText} successfully`,
    };
  } catch (error) {
    Logger.error("Error getting updating property unit:", error);
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
