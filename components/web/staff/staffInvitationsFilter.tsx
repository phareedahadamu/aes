"use client";
import { useSearchParams } from "next/navigation";
import FilterCommand from "../inputsAndFilters/filterCommand";
import { Tab, FilterGroup } from "@/lib/types/general";
import { Role } from "@/generated/prisma/enums";
import { normalizeText } from "@/lib/utils";
export default function StaffInvitationsFilter() {
  function isValidRole(val: string | null): val is Role {
    if (!val) return false;
    return (Object.values(Role) as string[]).includes(val);
  }
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab = Object.values(Tab).includes(tabParam as Tab)
    ? (tabParam as Tab)
    : Tab.STAFF;
  const roleParam = searchParams.get("role");
  const role = isValidRole(roleParam) ? roleParam : undefined;
  const isActiveParam = searchParams.get("isActive");
  const isActive =
    isActiveParam === "true"
      ? true
      : isActiveParam === "false"
        ? false
        : undefined;
  const usedParam = searchParams.get("used");
  const used =
    usedParam === "true" ? true : usedParam === "false" ? false : undefined;
  const expiredParam = searchParams.get("expired");
  const expired =
    expiredParam === "true"
      ? true
      : expiredParam === "false"
        ? false
        : undefined;
  const allRoles = Object.values(Role).map((rl) => {
    return { name: normalizeText(rl), value: rl, active: rl === role };
  });
  const invitationFilters: FilterGroup[] = [
    {
      group: "Status",
      items: [
        {
          name: "Used",
          value: "true",
          active: typeof used === "boolean" && used,
        },
        {
          name: "Unused",
          value: "false",
          active: typeof used === "boolean" && !used,
        },
      ],
      param: "used",
      allTag: "Used & Unused",
    },
    {
      group: "Valid",
      items: [
        {
          name: "Active",
          value: "false",
          active: typeof expired === "boolean" && !expired,
        },
        {
          name: "Expired",
          value: "true",
          active: typeof expired === "boolean" && !expired,
        },
      ],
      param: "expired",
      allTag: "Active & Expired",
    },
  ];
  const staffFilters: FilterGroup[] = [
    {
      group: "Role",
      items: allRoles,
      param: "role",
      allTag: "All roles",
    },
    {
      group: "Account Status",
      items: [
        {
          name: "Active",
          value: "true",
          active: typeof isActive === "boolean" && isActive,
        },
        {
          name: "Disabled",
          value: "false",
          active: typeof isActive === "boolean" && !isActive,
        },
      ],
      param: "isActive",
      allTag: "All accounts",
    },
  ];
  const filters =
    activeTab === Tab.STAFF
      ? staffFilters
      : activeTab === Tab.INVITATIONS
        ? invitationFilters
        : [];
  return <FilterCommand filters={filters} />;
}
