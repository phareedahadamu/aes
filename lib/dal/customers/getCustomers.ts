"use server";
import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  IGetCustomersProps,
  IGetCustomerStatsProps,
} from "@/lib/types/customers";
import { PAGE_LIMITS } from "@/lib/constants/general";
import { IPagination } from "@/lib/types/general";
import { sanitizePayload } from "@/lib/utils";
import type { Customer } from "@/generated/prisma/client";
import { CustomerWhereInput } from "@/generated/prisma/models";
import { handlePrismaError } from "@/lib/errorHandlers";
import { APIError } from "better-auth";
import {
  GetCustomersPayloadSchema,
  GetCustomerByIdPayloadSchema,
} from "./schema.customers";
import { Logger } from "@/lib/classes";
import { AppError } from "@/lib/classes";

export async function getPaginatedCustomers({
  page = 1,
  limit = PAGE_LIMITS.SM,
  searchQuery,
}: IGetCustomersProps): Promise<{
  success: boolean;
  message: string;
  data: {
    customers: ({
      properties: {
        id: string;
        balance: number;
      }[];
      _count: {
        properties: number;
      };
    } & Customer)[];
    pagination: IPagination;
  } | null;
}> {
  try {
    const user = await getAuthUser();
    if (!user) {
      return {
        success: false,
        data: null,
        message: "Unauthorized. Sign in to access customers details",
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
      },
      GetCustomersPayloadSchema,
    );

    const where: CustomerWhereInput = {
      ...(parsedData.searchQuery && {
        OR: [
          {
            email: {
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
    };
    const [customers, totalItems] = await Promise.all([
      prisma.customer.findMany({
        include: {
          _count: {
            select: { properties: true },
          },
          properties: {
            select: {
              id: true,
              balance: true,
            },
          },
        },
        where,
        skip: (parsedData.page - 1) * parsedData.limit,
        take: parsedData.limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.customer.count({ where }),
    ]);
    const pagination = {
      totalItems,
      itemCount: customers.length,
      itemsPerPage: parsedData.limit,
      totalPages: Math.max(1, Math.ceil(totalItems / parsedData.limit)),
      currentPage: parsedData.page,
    };
    return {
      success: true,
      message: "Customers details successfully retrieved",
      data: { customers, pagination },
    };
  } catch (error) {
    Logger.error("Error getting Customers details:", error);
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

export async function getCustomerById({
  customerId,
}: {
  customerId: string;
}): Promise<{
  success: boolean;
  message: string;
  data: (Customer & { _count: { properties: number } }) | null;
}> {
  try {
    const user = await getAuthUser();
    if (!user) {
      return {
        success: false,
        data: null,
        message: "Unauthorized. Sign in to access customer details",
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
        customerId,
      },
      GetCustomerByIdPayloadSchema,
    );
    const customer = await prisma.customer.findUnique({
      where: { id: parsedData.customerId },
      include: { _count: { select: { properties: true } } },
    });
    return {
      success: true,
      message: "Customer details successfully retrieved",
      data: customer,
    };
  } catch (error) {
    Logger.error("Error getting customer details:", error);
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

export async function getCustomerStats({
  customerId,
}: {
  customerId: string;
}): Promise<{
  success: boolean;
  message: string;
  data: IGetCustomerStatsProps | null;
}> {
  try {
    const user = await getAuthUser();
    if (!user) {
      return {
        success: false,
        data: null,
        message: "Unauthorized. Sign in to access customer profile stats",
      };
    }
    if (!user.isActive) {
      return {
        success: false,
        data: null,
        message: "Unauthorized. Disabled account.",
      };
    }

    const [
      activeProperties,
      inActiveProperties,
      activeOutstanding,
      totalOutstanding,
    ] = await Promise.all([
      prisma.property.count({ where: { ownerId: customerId, isActive: true } }),
      prisma.property.count({
        where: { ownerId: customerId, isActive: false },
      }),
      prisma.property.aggregate({
        where: { ownerId: customerId, isActive: true },
        _sum: {
          balance: true,
        },
      }),
      prisma.property.aggregate({
        where: { ownerId: customerId },
        _sum: {
          balance: true,
        },
      }),
    ]);

    return {
      success: true,
      data: {
        activeProperties,
        inActiveProperties,
        activeOutstanding: activeOutstanding._sum.balance ?? 0,
        totalOutstanding: totalOutstanding._sum.balance ?? 0,
      },
      message: "Stats retrieved successfully",
    };
  } catch (error) {
    Logger.error("Customer Profile Stats Error:", error);
    return {
      success: false,
      data: null,
      message: "Failed to retrieve stats",
    };
  }
}

export type StreamlinedCustomerType = Pick<
  Customer,
  "id" | "email" | "name" | "phoneNo"
>;
export async function getCustomersSearched({
  page = 1,
  limit = PAGE_LIMITS.SM,
  searchQuery,
}: IGetCustomersProps): Promise<{
  success: boolean;
  message: string;
  data: {
    customers: StreamlinedCustomerType[];
    pagination: IPagination;
  } | null;
}> {
  try {
    const user = await getAuthUser();
    if (!user) {
      return {
        success: false,
        data: null,
        message: "Unauthorized. Sign in to access customers details",
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
      },
      GetCustomersPayloadSchema,
    );

    const where: CustomerWhereInput = {
      ...(parsedData.searchQuery
        ? {
            OR: [
              {
                email: {
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
    };
    const [customers, totalItems] = await Promise.all([
      prisma.customer.findMany({
        select: { id: true, name: true, email: true, phoneNo: true },
        where,
        skip: (parsedData.page - 1) * parsedData.limit,
        take: parsedData.limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.customer.count({ where }),
    ]);
    const pagination = {
      totalItems,
      itemCount: customers.length,
      itemsPerPage: parsedData.limit,
      totalPages: Math.max(1, Math.ceil(totalItems / parsedData.limit)),
      currentPage: parsedData.page,
    };
    return {
      success: true,
      message: "Customers details successfully retrieved",
      data: { customers, pagination },
    };
  } catch (error) {
    Logger.error("Error getting Customers details:", error);
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
