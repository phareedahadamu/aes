"use server";

import { getAuthUser } from "@/lib/auth";
import { Role } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";

/**
 * Retrieves staff stats like total staff, active staff, inactive staff and pending invitations from the db
 * @returns an object which includes- success: boolean, data: the retrieved values- total staff, active staff, inactive staff and pending invitations or null, and a message
 */
export async function getStaffStats(): Promise<{
  success: boolean;
  message: string;
  data: {
    totalStaff: number;
    activeStaff: number;
    inactiveStaff: number;
    pendingInvitations: number;
  } | null;
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
