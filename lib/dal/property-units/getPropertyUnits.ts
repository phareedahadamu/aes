"use server";
import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  IPropertyUnitsMetrics,
  IGetPropertyUnitsProps,
} from "@/lib/types/property-units";
import { PAGE_LIMITS } from "@/lib/constants/general";
import { IPagination } from "@/lib/types/general";
import { sanitizePayload } from "@/lib/utils";
import type { Unit } from "@/generated/prisma/client";
import { UnitWhereInput } from "@/generated/prisma/models";
import { handlePrismaError } from "@/lib/errorHandlers";
import { APIError } from "better-auth";
import { GetPropertyUnitsPayloadSchema } from "./schema.propertyUnits";
import { Logger } from "@/lib/classes";
import { AppError } from "@/lib/classes";
export async function getPropertyUnitsStats(): Promise<{
  success: boolean;
  message: string;
  data: IPropertyUnitsMetrics | null;
}> {
  try {
    const user = await getAuthUser();
    if (!user) {
      return {
        success: false,
        data: null,
        message: "Unauthorized. Sign in to access property units stats",
      };
    }
    if (!user.isActive) {
      return {
        success: false,
        data: null,
        message: "Unauthorized. Disabled account.",
      };
    }

    const [totalUnits, activeUnits] = await Promise.all([
      prisma.unit.count(),
      prisma.unit.count({ where: { isActive: true } }),
    ]);

    return {
      success: true,
      data: {
        totalUnits,
        activeUnits,
        inactiveUnits: totalUnits - activeUnits,
      },
      message: "Stats retrieved successfully",
    };
  } catch (error) {
    Logger.error("Property units stats Error:", error);
    return {
      success: false,
      data: null,
      message: "Failed to retrieve stats",
    };
  }
}

export async function getPaginatedPropertyUnits({
  page = 1,
  limit = PAGE_LIMITS.SM,
  searchQuery,
  isActive,
}: IGetPropertyUnitsProps): Promise<{
  success: boolean;
  message: string;
  data: { units: Unit[]; pagination: IPagination } | null;
}> {
  try {
    const user = await getAuthUser();
    if (!user) {
      return {
        success: false,
        data: null,
        message: "Unauthorized. Sign in to access property units details",
      };
    }
    if (!user.isActive) {
      return {
        success: false,
        data: null,
        message: "Unauthorized. Disabled account.",
      };
    }
    const parsedData = sanitizePayload(
      {
        page,
        limit,
        searchQuery,
        isActive,
      },
      GetPropertyUnitsPayloadSchema,
    );

    const where: UnitWhereInput = {
      ...(parsedData.searchQuery && {
        OR: [
          {
            code: {
              contains: parsedData.searchQuery,
              mode: "insensitive",
            },
          },
          {
            name: {
              contains: parsedData.searchQuery,
              mode: "insensitive",
            },
          },
        ],
      }),

      ...(typeof parsedData.isActive === "boolean" && {
        isActive: parsedData.isActive,
      }),
    };
    const [units, totalItems] = await Promise.all([
      prisma.unit.findMany({
        where,
        skip: (parsedData.page - 1) * parsedData.limit,
        take: parsedData.limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.unit.count({ where }),
    ]);
    const pagination = {
      totalItems,
      itemCount: units.length,
      itemsPerPage: parsedData.limit,
      totalPages: Math.max(1, Math.ceil(totalItems / parsedData.limit)),
      currentPage: parsedData.page,
    };
    return {
      success: true,
      message: "Property units details successfully retrieved",
      data: { units, pagination },
    };
  } catch (error) {
    Logger.error("Error getting Property units details:", error);
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
