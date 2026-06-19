"use server";
import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { IGetStreetsProps } from "@/lib/types/service-areas";
import { PAGE_LIMITS } from "@/lib/constants/general";
import { IPagination } from "@/lib/types/general";
import { sanitizePayload } from "@/lib/utils";
import type { Street } from "@/generated/prisma/client";
import { StreetWhereInput } from "@/generated/prisma/models";
import { handlePrismaError } from "@/lib/errorHandlers";
import { APIError } from "better-auth";
import { GetStreetPayloadSchema } from "./schema.streets";
import { Logger } from "@/lib/classes";
import { AppError } from "@/lib/classes";

export async function getPaginatedStreets({
  page = 1,
  limit = PAGE_LIMITS.SM,
  searchQuery,
  isActive,
  wardId,
}: IGetStreetsProps): Promise<{
  success: boolean;
  message: string;
  data: {
    streets: ({
      _count: {
        properties: number;
      };
    } & Street)[];
    pagination: IPagination;
  } | null;
}> {
  try {
    const user = await getAuthUser();
    if (!user) {
      return {
        success: false,
        data: null,
        message: "Unauthorized. Sign in to access streets details",
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
        wardId,
      },
      GetStreetPayloadSchema,
    );

    const where: StreetWhereInput = {
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
      wardId,
    };
    const [streets, totalItems] = await Promise.all([
      prisma.street.findMany({
        include: {
          _count: {
            select: { properties: true },
          },
        },
        where,
        skip: (parsedData.page - 1) * parsedData.limit,
        take: parsedData.limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.street.count({ where }),
    ]);
    const pagination = {
      totalItems,
      itemCount: streets.length,
      itemsPerPage: parsedData.limit,
      totalPages: Math.max(1, Math.ceil(totalItems / parsedData.limit)),
      currentPage: parsedData.page,
    };
    return {
      success: true,
      message: "Streets details successfully retrieved",
      data: { streets, pagination },
    };
  } catch (error) {
    Logger.error("Error getting Streets details:", error);
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
