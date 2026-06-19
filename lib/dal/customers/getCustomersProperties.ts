"use server";
import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { IGetCustomersPropertiesProps } from "@/lib/types/customers";
import { PAGE_LIMITS } from "@/lib/constants/general";
import { IPagination } from "@/lib/types/general";
import { sanitizePayload } from "@/lib/utils";
import type { Property } from "@/generated/prisma/client";
import { PropertyWhereInput } from "@/generated/prisma/models";
import { handlePrismaError } from "@/lib/errorHandlers";
import { APIError } from "better-auth";
import { GetCustomersPropertiesPayloadSchema } from "./schema.customers";
import { Logger } from "@/lib/classes";
import { AppError } from "@/lib/classes";

export async function getPaginatedCustomersProperties({
  page = 1,
  limit = PAGE_LIMITS.SM,
  searchQuery,
  id,
}: IGetCustomersPropertiesProps): Promise<{
  success: boolean;
  message: string;
  data: {
    properties: Property[];
    pagination: IPagination;
  } | null;
}> {
  try {
    const user = await getAuthUser();
    if (!user) {
      return {
        success: false,
        data: null,
        message: "Unauthorized. Sign in to access customer properties details",
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
        id,
      },
      GetCustomersPropertiesPayloadSchema,
    );

    const where: PropertyWhereInput = {
      id: parsedData.id,
      ...(parsedData.searchQuery && {
        code: {
          contains: parsedData.searchQuery,
          mode: "insensitive",
        },
      }),
    };
    const [properties, totalItems] = await Promise.all([
      prisma.property.findMany({
        where,
        skip: (parsedData.page - 1) * parsedData.limit,
        take: parsedData.limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.property.count({ where }),
    ]);
    const pagination = {
      totalItems,
      itemCount: properties.length,
      itemsPerPage: parsedData.limit,
      totalPages: Math.max(1, Math.ceil(totalItems / parsedData.limit)),
      currentPage: parsedData.page,
    };
    return {
      success: true,
      message: "Customer properties details successfully retrieved",
      data: { properties, pagination },
    };
  } catch (error) {
    Logger.error("Error getting Customers properties details:", error);
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
