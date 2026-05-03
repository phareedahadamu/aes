"use server";

import { getAuthUser } from "@/lib/auth";
import { Role } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import {
  IStaffMetrics,
  IGetStaffProps,
  IGetInvitationsProps,
} from "@/lib/types/staff";
import { User, Invitation } from "@/generated/prisma/client";
import { IPagination } from "@/lib/types/general";
import { PAGE_LIMITS } from "@/lib/constants/general";
import {
  GetStaffPayloadSchema,
  GetInvitationsPayloadSchema,
} from "./schema.staff";
import { verifyAdminAccess } from "../accessControl";
import { AppError, Logger } from "@/lib/classes";
import { sanitizePayload } from "@/lib/utils";
import {
  UserWhereInput,
  InvitationWhereInput,
} from "@/generated/prisma/models";
import { handlePrismaError } from "@/lib/errorHandlers";
import { APIError } from "better-auth";

/**
 * Retrieves staff stats like total staff, active staff, inactive staff and pending invitations from the db
 * @returns an object which includes- success: boolean, data: the retrieved values- total staff, active staff, inactive staff and pending invitations or null, and a message
 */
export async function getStaffStats(): Promise<{
  success: boolean;
  message: string;
  data: IStaffMetrics | null;
}> {
  try {
    const user = await getAuthUser();
    if (!user) {
      return {
        success: false,
        data: null,
        message: "Unauthorized. Sign in to access staff stats",
      };
    }
    if (user.role !== Role.ADMIN) {
      return {
        success: false,
        data: null,
        message: "Unauthorized. Only Admins can view staff stats",
      };
    }
    if (!user.isActive) {
      return {
        success: false,
        data: null,
        message: "Unauthorized. Disabled account.",
      };
    }

    const [totalStaff, activeStaff, pendingInvitations] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.invitation.count({
        where: { used: false, expiresAt: { gt: new Date() } },
      }),
    ]);

    return {
      success: true,
      data: {
        totalStaff,
        activeStaff,
        inactiveStaff: totalStaff - activeStaff,
        pendingInvitations,
      },
      message: "Stats retrieved successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: null,
      message: "Failed to retrieve stats",
    };
  }
}

export async function getPaginatedStaff({
  page = 1,
  limit = PAGE_LIMITS.SM,
  emailQuery,
  role,
  isActive,
}: IGetStaffProps): Promise<{
  success: boolean;
  message: string;
  data: { users: User[]; pagination: IPagination } | null;
}> {
  try {
    const parsedData = sanitizePayload(
      {
        page,
        limit,
        emailQuery,
        role,
        isActive,
      },
      GetStaffPayloadSchema,
    );
    await verifyAdminAccess();

    const where: UserWhereInput = {
      ...(parsedData.emailQuery && {
        email: {
          contains: parsedData.emailQuery,
          mode: "insensitive",
        },
      }),

      ...(parsedData.role && {
        role: parsedData.role,
      }),

      ...(typeof parsedData.isActive === "boolean" && {
        isActive: parsedData.isActive,
      }),
    };
    const [users, totalItems] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (parsedData.page - 1) * parsedData.limit,
        take: parsedData.limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);
    const pagination = {
      totalItems,
      itemCount: users.length,
      itemsPerPage: parsedData.limit,
      totalPages: Math.max(1, Math.ceil(totalItems / parsedData.limit)),
      currentPage: parsedData.page,
    };
    return {
      success: true,
      message: "Staff details successfully retrieved",
      data: { users, pagination },
    };
  } catch (error) {
    Logger.error("Error getting Staff details:", error);
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

export async function getPaginatedInvitations({
  page = 1,
  limit = PAGE_LIMITS.SM,
  emailQuery,
  isUsed,
  isExpired,
}: IGetInvitationsProps): Promise<{
  success: boolean;
  message: string;
  data: { invitations: Invitation[]; pagination: IPagination } | null;
}> {
  try {
    const parsedData = sanitizePayload(
      {
        page,
        limit,
        emailQuery,
        isUsed,
        isExpired,
      },
      GetInvitationsPayloadSchema,
    );
    await verifyAdminAccess();

    const where: InvitationWhereInput = {
      ...(parsedData.emailQuery && {
        email: {
          contains: parsedData.emailQuery,
          mode: "insensitive",
        },
      }),

      ...(typeof parsedData.isUsed === "boolean" && {
        used: parsedData.isUsed,
      }),
      ...(typeof parsedData.isExpired === "boolean" && {
        expiresAt: parsedData.isExpired
          ? { lt: new Date() }
          : { gte: new Date() },
      }),
    };
    const [invitations, totalItems] = await Promise.all([
      prisma.invitation.findMany({
        where,
        skip: (parsedData.page - 1) * parsedData.limit,
        take: parsedData.limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.invitation.count({ where }),
    ]);
    const pagination = {
      totalItems,
      itemCount: invitations.length,
      itemsPerPage: parsedData.limit,
      totalPages: Math.max(1, Math.ceil(totalItems / parsedData.limit)),
      currentPage: parsedData.page,
    };
    return {
      success: true,
      message: "Invitation details successfully retrieved",
      data: { invitations, pagination },
    };
  } catch (error) {
    Logger.error("Error getting Invitation details:", error);
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
