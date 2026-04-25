import { notFound } from "next/navigation";
import { Role } from "@/generated/prisma/enums";
import { verifyAccess } from "@/lib/dal/accessControl";
export default async function ServiceAreasPage() {
  const hasAccess = verifyAccess([Role.ADMIN, Role.OPERATIONS, Role.REPORTS]);
  if (!hasAccess) return notFound();
  return <div>Service Areas</div>;
}
