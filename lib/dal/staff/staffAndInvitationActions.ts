"use server";

import { Role } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { sanitizePayload } from "@/lib/utils";
import {
  ActivateOrDeactivateStaffPayloadSchema,
  ChangeStaffRolePayloadSchema,
  RevokeReactivateInvitationPayloadSchema,
} from "./schema.staff";
import { verifyAdminAccess } from "../accessControl";
import { AppError, Logger } from "@/lib/classes";
import { handlePrismaError } from "@/lib/errorHandlers";
import { APIError } from "better-auth";
export async function activateOrDeactivateStaff(
  _prevState: {
    success: boolean;
    message: string;
  } | null,
  payload: {
    staffId: string;
  },
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const parsedPayload = sanitizePayload(
      payload,
      ActivateOrDeactivateStaffPayloadSchema,
    );
    const user = await verifyAdminAccess();
    const staffMember = await prisma.user.findUnique({
      where: {
        id: parsedPayload.staffId,
      },
    });
    if (!staffMember) {
      throw new AppError("Staff member not found", 404);
    }
    if (staffMember.isSuperAdmin) {
      throw new AppError(
        "Unauthorized. Cannot change status of a Super Admin",
        401,
      );
    }
    if (staffMember.id === user.id) {
      throw new AppError(
        "You cannot change the status of your own account",
        400,
      );
    }
    if (staffMember.role === Role.ADMIN && !user.isSuperAdmin) {
      throw new AppError(
        "Unauthorized. Only Super Admins can perform this action",
        401,
      );
    }
    const updatedStaff = await prisma.user.update({
      where: {
        id: parsedPayload.staffId,
      },
      data: {
        isActive: !staffMember.isActive,
      },
    });
    if (!updatedStaff) {
      throw new AppError("Failed to update staff status", 500);
    }
    return {
      success: true,
      message: `Staff has been successfully ${staffMember.isActive ? "deactivated" : "activated"}`,
    };
  } catch (error) {
    Logger.error("Error getting updating Staff members status:", error);
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

export async function changeStaffRole(
  _prevState: {
    success: boolean;
    message: string;
  } | null,
  payload: {
    staffId: string;
    role: Role;
  },
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const parsedPayload = sanitizePayload(
      payload,
      ChangeStaffRolePayloadSchema,
    );
    const user = await verifyAdminAccess();
    const staffMember = await prisma.user.findUnique({
      where: {
        id: parsedPayload.staffId,
      },
    });
    if (!staffMember) {
      throw new AppError("Staff member not found", 404);
    }
    if (staffMember.isSuperAdmin) {
      throw new AppError(
        "Unauthorized. Cannot change role of a Super Admin",
        401,
      );
    }
    if (staffMember.id === user.id) {
      throw new AppError("You cannot change the role of your own account", 400);
    }
    if (staffMember.role === Role.ADMIN && !user.isSuperAdmin) {
      throw new AppError(
        "Unauthorized. Only Super Admins can change Admin roles",
        401,
      );
    }
    if (parsedPayload.role === Role.ADMIN && !user.isSuperAdmin) {
      throw new AppError(
        "Unauthorized. Only Super Admins can assign Admin roles",
        401,
      );
    }
    const updatedStaff = await prisma.user.update({
      where: {
        id: parsedPayload.staffId,
      },
      data: {
        role: parsedPayload.role,
      },
    });
    if (!updatedStaff) {
      throw new AppError("Failed to update staff role", 500);
    }
    return {
      success: true,
      message: `Staff role been successfully updated`,
    };
  } catch (error) {
    Logger.error("Error getting updating Staff members status:", error);
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

export async function revokeInvitation(
  _prevState: {
    success: boolean;
    message: string;
  } | null,
  payload: {
    invitationId: string;
  },
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const parsedPayload = sanitizePayload(
      payload,
      RevokeReactivateInvitationPayloadSchema,
    );
    await verifyAdminAccess();
    const invitation = await prisma.invitation.findUnique({
      where: {
        id: parsedPayload.invitationId,
      },
    });
    if (!invitation) {
      throw new AppError("Invitation not found", 404);
    }
    const isExpired = new Date(invitation?.expiresAt) < new Date();
    if (!invitation.used || !isExpired) {
      throw new AppError("Invitation has not been used or not expired");
    }
    const staff = await prisma.user.findUnique({
      where: { email: invitation.email },
    });

    if (staff) {
      throw new AppError("Staff has already registered");
    }
    const updatedInvitation = await prisma.invitation.update({
      where: {
        id: parsedPayload.invitationId,
      },
      data: {
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        used: false,
      },
    });

    if (!updatedInvitation) {
      throw new AppError("Failed to update invitation", 500);
    }
    // TODO send new email
    // if it fails reset invite

    return {
      success: true,
      message: `Invitation sucessfully reactivated`,
    };
  } catch (error) {
    Logger.error("Error getting revoking invitation:", error);
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

export async function reactivateInvitation(
  _prevState: {
    success: boolean;
    message: string;
  } | null,
  payload: {
    invitationId: string;
  },
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const parsedPayload = sanitizePayload(
      payload,
      RevokeReactivateInvitationPayloadSchema,
    );
    await verifyAdminAccess();
    const invitation = await prisma.invitation.findUnique({
      where: {
        id: parsedPayload.invitationId,
      },
    });
    if (!invitation) {
      throw new AppError("Invitation not found", 404);
    }
    const isExpired = new Date(invitation?.expiresAt) < new Date();
    if (!invitation.used && !isExpired) {
      throw new AppError("Invitation has not been used and not expired");
    }
    if (invitation.used || isExpired) {
      throw new AppError("Invitation has already been used or is expired");
    }

    const updatedInvitation = await prisma.invitation.update({
      where: {
        id: parsedPayload.invitationId,
      },
      data: {
        expiresAt: new Date(),
      },
    });

    if (!updatedInvitation) {
      throw new AppError("Failed to update invitation", 500);
    }

    return {
      success: true,
      message: `Invitation sucessfully revoked`,
    };
  } catch (error) {
    Logger.error("Error getting revoking invitation:", error);
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
