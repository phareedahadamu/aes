import {
  LucideIcon,
  LayoutDashboard,
  MapPinned,
  UsersRound,
  Warehouse,
  Receipt,
  BanknoteArrowUp,
  Settings2,
  FileChartColumn,
  ScrollText,
  UserRoundCog,
  Component,
} from "lucide-react";
import { Role } from "@/generated/prisma/enums";

enum NavGroup {
  OVERVIEW = "Overview",
  FINANCE = "Finance",
  SYSTEM = "System",
  SETTINGS = "Settings",
}
interface NavItems {
  group: NavGroup;
  name: string;
  href: string;
  visibleTo: Role[];
  icon: LucideIcon;
}
interface NavSections {
  title: NavGroup;
  visibleTo: Role[];
  items: NavItems[];
}

export const appRoutes: NavItems[] = [
  {
    group: NavGroup.OVERVIEW,
    name: "Dashboard",
    href: "/",
    visibleTo: [Role.ADMIN, Role.OPERATIONS, Role.REPORTS],
    icon: LayoutDashboard,
  },
  {
    group: NavGroup.OVERVIEW,
    name: "Service Areas",
    href: "/service-areas",
    visibleTo: [Role.ADMIN, Role.OPERATIONS, Role.REPORTS],
    icon: MapPinned,
  },
  {
    group: NavGroup.OVERVIEW,
    name: "Customers",
    href: "/customers",
    visibleTo: [Role.ADMIN, Role.OPERATIONS, Role.REPORTS],
    icon: UsersRound,
  },
  {
    group: NavGroup.OVERVIEW,
    name: "Properties",
    href: "/properties",
    visibleTo: [Role.ADMIN, Role.OPERATIONS, Role.REPORTS],
    icon: Warehouse,
  },
  {
    group: NavGroup.FINANCE,
    name: "Billing Center",
    href: "/billing-center",
    visibleTo: [Role.ADMIN, Role.OPERATIONS],
    icon: Receipt,
  },
  {
    group: NavGroup.FINANCE,
    name: "Payments",
    href: "/payments",
    visibleTo: [Role.ADMIN, Role.OPERATIONS],
    icon: BanknoteArrowUp,
  },
  {
    group: NavGroup.FINANCE,
    name: "Adjustments",
    href: "/adjustments",
    visibleTo: [Role.ADMIN, Role.OPERATIONS],
    icon: Settings2,
  },
  {
    group: NavGroup.SYSTEM,
    name: "Reports",
    href: "/reports",
    visibleTo: [Role.ADMIN, Role.OPERATIONS, Role.REPORTS],
    icon: FileChartColumn,
  },
  {
    group: NavGroup.SYSTEM,
    name: "Staff",
    href: "/staff",
    visibleTo: [Role.ADMIN],
    icon: UserRoundCog,
  },
  {
    group: NavGroup.SYSTEM,
    name: "Activity Logs",
    href: "/activity-logs",
    visibleTo: [Role.ADMIN],
    icon: ScrollText,
  },
  {
    group: NavGroup.SETTINGS,
    name: "Property Units",
    href: "/property-units",
    visibleTo: [Role.ADMIN, Role.OPERATIONS, Role.REPORTS],
    icon: Component,
  },
];
export const navSections: NavSections[] = Object.values(NavGroup).map(
  (groupName) => {
    const items = appRoutes.filter((item) => item.group === groupName);

    const visibleTo = Array.from(
      new Set(items.flatMap((item) => item.visibleTo)),
    );

    return {
      title: groupName,
      visibleTo,
      items,
    };
  },
);
