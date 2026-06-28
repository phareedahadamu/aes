"use server";
import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  IServiceAreasMetrics,
  IGetServiceAreasProps,
} from "@/lib/types/service-areas";
import { PAGE_LIMITS } from "@/lib/constants/general";
import { IPagination } from "@/lib/types/general";
import { sanitizePayload } from "@/lib/utils";
import type { Ward } from "@/generated/prisma/client";
import { WardWhereInput } from "@/generated/prisma/models";
import { handlePrismaError } from "@/lib/errorHandlers";
import { APIError } from "better-auth";
import {
  GetServiceAreasPayloadSchema,
  GetWardByIdPayloadSchema,
} from "./schema.serviceAreas";
import { Logger } from "@/lib/classes";
import { AppError } from "@/lib/classes";

export async function getServiceAreasStats(): Promise<{
  success: boolean;
  message: string;
  data: IServiceAreasMetrics | null;
}> {
  try {
    const user = await getAuthUser();
    if (!user) {
      return {
        success: false,
        data: null,
        message: "Unauthorized. Sign in to access service areas stats",
      };
    }
    if (!user.isActive) {
      return {
        success: false,
        data: null,
        message: "Unauthorized. Disabled account.",
      };
    }

    const [totalWards, totalStreets, totalProperties, inactiveAreas] =
      await Promise.all([
        prisma.ward.count(),
        prisma.street.count(),
        prisma.property.count(),
        prisma.ward.count({ where: { isActive: false } }),
      ]);

    return {
      success: true,
      data: {
        totalWards,
        totalStreets,
        totalProperties,
        inactiveAreas,
      },
      message: "Stats retrieved successfully",
    };
  } catch (error) {
    Logger.error("Service Areas Stats Error:", error);
    return {
      success: false,
      data: null,
      message: "Failed to retrieve stats",
    };
  }
}

export async function getPaginatedServiceAreas({
  page = 1,
  limit = PAGE_LIMITS.SM,
  searchQuery,
  isActive,
}: IGetServiceAreasProps): Promise<{
  success: boolean;
  message: string;
  data: {
    wards: ({
      streets: ({
        _count: {
          properties: number;
        };
      } & { id: string })[];
      _count: {
        streets: number;
      };
    } & Ward)[];
    pagination: IPagination;
  } | null;
}> {
  try {
    const user = await getAuthUser();
    if (!user) {
      return {
        success: false,
        data: null,
        message: "Unauthorized. Sign in to access service area details",
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
      GetServiceAreasPayloadSchema,
    );

    const where: WardWhereInput = {
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
    const [wards, totalItems] = await Promise.all([
      prisma.ward.findMany({
        include: {
          _count: {
            select: { streets: true },
          },
          streets: {
            select: {
              id: true,
              _count: {
                select: { properties: true },
              },
            },
          },
        },
        where,
        skip: (parsedData.page - 1) * parsedData.limit,
        take: parsedData.limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.ward.count({ where }),
    ]);
    const pagination = {
      totalItems,
      itemCount: wards.length,
      itemsPerPage: parsedData.limit,
      totalPages: Math.max(1, Math.ceil(totalItems / parsedData.limit)),
      currentPage: parsedData.page,
    };
    return {
      success: true,
      message: "Service Areas details successfully retrieved",
      data: { wards, pagination },
    };
  } catch (error) {
    Logger.error("Error getting Service Areas details:", error);
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

export async function getWardById({ wardId }: { wardId: string }): Promise<{
  success: boolean;
  message: string;
  data: ({ _count: { streets: number } } & Ward) | null;
}> {
  try {
    const user = await getAuthUser();
    if (!user) {
      return {
        success: false,
        data: null,
        message: "Unauthorized. Sign in to access service area details",
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
        wardId,
      },
      GetWardByIdPayloadSchema,
    );
    const ward = await prisma.ward.findUnique({
      where: { id: parsedData.wardId },
      include: {
        _count: {
          select: { streets: true },
        },
      },
    });
    return {
      success: true,
      message: "Ward details successfully retrieved",
      data: ward,
    };
  } catch (error) {
    Logger.error("Error getting Ward details:", error);
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

export async function getWardsSearched({
  page = 1,
  limit = PAGE_LIMITS.SM,
  searchQuery,
  isActive,
}: IGetServiceAreasProps): Promise<{
  success: boolean;
  message: string;
  data: {
    wards: TStreamLinedWard[];
    pagination: IPagination;
  } | null;
}> {
  try {
    const user = await getAuthUser();
    if (!user) {
      return {
        success: false,
        data: null,
        message: "Unauthorized. Sign in to access service area details",
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
      GetServiceAreasPayloadSchema,
    );

    const where: WardWhereInput = {
      ...(parsedData.searchQuery
        ? {
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
          }
        : undefined),

      ...(typeof parsedData.isActive === "boolean" && {
        isActive: parsedData.isActive,
      }),
    };
    const [wards, totalItems] = await Promise.all([
      prisma.ward.findMany({
        select: { id: true, code: true, name: true },
        where,
        skip: (parsedData.page - 1) * parsedData.limit,
        take: parsedData.limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.ward.count({ where }),
    ]);
    const pagination = {
      totalItems,
      itemCount: wards.length,
      itemsPerPage: parsedData.limit,
      totalPages: Math.max(1, Math.ceil(totalItems / parsedData.limit)),
      currentPage: parsedData.page,
    };
    return {
      success: true,
      message: "Service Areas details successfully retrieved",
      data: { wards, pagination },
    };
  } catch (error) {
    Logger.error("Error getting Service Areas details:", error);
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

export type TStreamLinedWard = Pick<Ward, "id" | "code" | "name">;
