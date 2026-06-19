"use server";
import { ExportCategories } from "../types/general";
import { verifyAdminAccess } from "../dal/accessControl";
import { sanitizePayload } from "../utils";
import { ExportSchema } from "./schema.export";
import prisma from "@/lib/prisma";
import ExcelJS from "exceljs";
import { AppError } from "../classes";
import { Logger } from "../classes";
import { APIError } from "better-auth/api";
import { handlePrismaError } from "@/lib/errorHandlers";

export async function exportTable(
  _prevState: {
    success: boolean;
    message: string;
  } | null,
  payload: {
    category: ExportCategories;
    isActive?: boolean;
    isUsed?: boolean;
    isExpired?: boolean;
    startDate?: Date;
    endDate?: Date;
    id?: string;
  },
): Promise<{
  success: boolean;
  data: {
    fileName: string;
    base64Url: string;
  } | null;
  message: string;
}> {
  try {
    const parsed = sanitizePayload(payload, ExportSchema);
    await verifyAdminAccess();
    const { isActive, isUsed, isExpired, startDate, endDate, category, id } =
      parsed;
    if (category === "properties-for-customer" && !id) {
      throw new AppError("Customer Id is required");
    }
    if (category === "payments-for-property" && !id) {
      throw new AppError("Property Id is required");
    }
    if (category === "streets-in-ward" && !id) {
      throw new AppError("Ward Id is required");
    }
    const fileName = category;
    const base64Url = await getTableData({
      category,
      isActive,
      isUsed,
      isExpired,
      startDate,
      endDate,
    });
    return {
      success: true,
      data: { fileName, base64Url },
      message: "Table data exported successfully!",
    };
  } catch (error) {
    Logger.error("Error getting exporting Data:", error);
    const message =
      error instanceof AppError
        ? error.message
        : error instanceof APIError
          ? "Authentication service is currently unavailable."
          : handlePrismaError(error);
    return {
      success: false,
      message: message,
      data: null,
    };
  }
}

async function getTableData({
  category,
  isActive,
  isUsed,
  isExpired,
  startDate,
  endDate,
  id,
}: {
  category: ExportCategories;
  isActive?: boolean;
  isUsed?: boolean;
  isExpired?: boolean;
  startDate?: Date;
  endDate?: Date;
  id?: string;
}) {
  switch (category) {
    case "property-units": {
      const res = await prisma.unit.findMany({
        where: {
          isActive,
        },
        select: { code: true, name: true, price: true, isActive: true },
      });
      return await convertDataToExcelBase64(res, "Units");
    }
    case "properties": {
      const res = await prisma.property.findMany({
        where: {
          isActive,
        },
        select: {
          code: true,
          address: true,
          balance: true,
          isActive: true,
          street: { select: { code: true, name: true } },
          owner: { select: { name: true } },
        },
      });
      return await convertDataToExcelBase64(res, "Properties");
    }
    case "customers": {
      const res = await prisma.customer.findMany({
        select: {
          address: true,
          name: true,
          email: true,
          phoneNo: true,
          _count: { select: { properties: true } },
        },
      });
      return await convertDataToExcelBase64(res, "Customers");
    }
    case "properties-for-customer": {
      const res = await prisma.property.findMany({
        where: {
          isActive,
          ownerId: id,
        },
        select: {
          code: true,
          address: true,
          balance: true,
          isActive: true,
          street: { select: { code: true, name: true } },
          owner: { select: { name: true } },
        },
      });
      return await convertDataToExcelBase64(res, "Properties for customer -");
    }
    case "streets-in-ward": {
      const res = await prisma.street.findMany({
        where: {
          isActive,
          wardId: id,
        },
        select: {
          code: true,
          name: true,
          isActive: true,
          ward: { select: { code: true, name: true } },
          _count: { select: { properties: true } },
        },
      });
      return await convertDataToExcelBase64(res, "Streets in ward - ");
    }
    case "payments": {
      const res = await prisma.payment.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          amount: true,
          createdAt: true,
          property: { select: { code: true, name: true } },
        },
      });
      return await convertDataToExcelBase64(res, "Payments ");
    }
    case "payments-for-property": {
      const res = await prisma.payment.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          propertyId: id,
        },
        select: {
          amount: true,
          createdAt: true,
          property: { select: { code: true, name: true } },
        },
      });
      return await convertDataToExcelBase64(res, "Payments for property -");
    }
    case "staff": {
      const res = await prisma.user.findMany({
        where: {
          isActive,
        },
        select: {
          name: true,
          email: true,
          role: true,
          isActive: true,
        },
      });
      return await convertDataToExcelBase64(res, "Staff");
    }
    case "invitations": {
      const res = await prisma.invitation.findMany({
        where: {
          used: isUsed,
          expiresAt: isExpired
            ? {
                lt: new Date(),
              }
            : undefined,
        },
        select: {
          email: true,
          role: true,
          used: true,
          expiresAt: true,
        },
      });
      return await convertDataToExcelBase64(res, "Invitations");
    }
    case "wards": {
      const res = await prisma.ward.findMany({
        where: {
          isActive,
        },
        select: {
          code: true,
          name: true,
          isActive: true,
        },
      });
      return await convertDataToExcelBase64(res, "Wards");
    }

    default: {
      const _exhaustiveCheck: never = category;
      throw new Error(`Unhandled category: ${_exhaustiveCheck}`);
    }
  }
}

export async function convertDataToExcelBase64<
  T extends Record<string, unknown>,
>(data: T[], sheetName: string): Promise<string> {
  if (!data || data.length === 0) {
    throw new AppError(
      "Cannot generate an Excel report from an empty dataset.",
    );
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  const flattenedData = data.map((row) => flattenObject(row));

  const firstRow = flattenedData[0];

  worksheet.columns = Object.keys(firstRow).map((key) => ({
    header: key.replace(/_/g, " ").toUpperCase(),
    key: key,
    width: 20,
  }));

  worksheet.addRows(flattenedData);
  const fileBuffer = await workbook.xlsx.writeBuffer();
  const base64String = Buffer.from(fileBuffer).toString("base64");

  return base64String;
}

function flattenObject<T extends Record<string, unknown>>(
  obj: T,
  delimiter = "_",
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const flattenedChild = flattenObject(
        value as Record<string, unknown>,
        delimiter,
      );

      for (const [childKey, childValue] of Object.entries(flattenedChild)) {
        result[`${key}${delimiter}${childKey}`] = childValue;
      }
    } else {
      result[key] = value;
    }
  }

  return result;
}
