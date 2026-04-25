"use server";

import { getAuthUser } from "../auth";
import { Role } from "@/generated/prisma/enums";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { appRoutes } from "../constants/appRoutes";

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
