"use server";

import { getAuthUser } from "../auth";
import { Role } from "@/generated/prisma/enums";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { appRoutes } from "../constants/appRoutes";
import { AppError } from "../classes";
import { User } from "@/lib/auth";

/**
 * Verifies if the user has access by checking if the users role is included in permitted roles
 * @param permittedRole an array of Roles that have access
 * @returns true if user has access and false if not
 */
export async function verifyAccess(permittedRole: Role[]) {
  const user = await getAuthUser();

  if (!user || !user.isActive) {
    redirect("/login");
  }
  const role = user.role as Role;
  if (!permittedRole.includes(role)) {
    return false;
  }

  return true;
}

export async function verifyPageAccess(pageName: string) {
  const currentRoute = appRoutes.find((route) => route.name === pageName);
  if (!currentRoute) {
    notFound();
  }
  const hasAccess = await verifyAccess(currentRoute.visibleTo);

  if (!hasAccess) {
    notFound();
  }
}

export async function verifyAdminAccess(): Promise<User> {
  const user = await getAuthUser();
  if (!user) {
    throw new AppError(`Unauthorized. Sign in to perform this action`, 401);
  }
  if (user.role !== Role.ADMIN) {
    throw new AppError(
      `Unauthorized. Only Admins can perform this action`,
      401,
    );
  }
  if (!user.isActive) {
    throw new AppError("Unauthorized. Disabled account.", 401);
  }
  return user;
}
