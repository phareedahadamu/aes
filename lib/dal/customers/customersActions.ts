"use server";

import { sanitizePayload } from "@/lib/utils";
import prisma from "@/lib/prisma";
import {
  AddCustomerPayloadSchema,
  EditCustomerPayloadSchema,
} from "./schema.customers";
import { verifyAdminAccess } from "../accessControl";
import { Logger } from "@/lib/classes";
import { AppError } from "@/lib/classes";
import { handlePrismaError } from "@/lib/errorHandlers";
import { APIError } from "better-auth/api";

export async function addCustomer(
  _prevState: {
    success: boolean;
    message: string;
  } | null,
  payload: {
    name: string;
    email?: string;
    address?: string;
    phoneNo: string;
  },
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Check Payload
    const parsed = sanitizePayload(payload, AddCustomerPayloadSchema);

    await verifyAdminAccess();

    const { name, email, address, phoneNo } = parsed;

    const customer = await prisma.customer.create({
      data: { name, email, phoneNo, address },
    });
    if (!customer) {
      return {
        success: false,
        message: "Couldn't create customer",
      };
    }
    return { success: true, message: "Customer created successfully" };
  } catch (error) {
    Logger.error("Error getting creating Customer:", error);
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

export async function editCustomer(
  _prevState: {
    success: boolean;
    message: string;
  } | null,
  payload: {
    customerId: string;
    name: string;
    email?: string;
    address?: string;
    phoneNo: string;
  },
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Check Payload
    const parsed = sanitizePayload(payload, EditCustomerPayloadSchema);

    await verifyAdminAccess();

    const { customerId, name, email, address, phoneNo } = parsed;

    const update = await prisma.customer.updateMany({
      where: { id: customerId },
      data: { name, email, address, phoneNo },
    });
    if (update.count < 1) {
      return {
        success: false,
        message: "Customer not found",
      };
    }
    return { success: true, message: "Customer updated successfully" };
  } catch (error) {
    Logger.error("Error getting updating Customer:", error);
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
 