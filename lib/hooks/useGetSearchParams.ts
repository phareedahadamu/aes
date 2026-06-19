import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Role } from "@/generated/prisma/enums";
import { PAGE_LIMITS } from "@/lib/constants/general";
import { Tab } from "@/lib/types/general";

function isValidLimit(val: number): val is PAGE_LIMITS {
  return Object.values(PAGE_LIMITS)
    .filter((v) => typeof v === "number")
    .includes(val);
}
function isValidRole(val: string | null): val is Role {
  if (!val) return false;
  return (Object.values(Role) as string[]).includes(val);
}
export default function useGetSearchParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  //   Search Query
  const search = searchParams.get("search") || undefined;

  //   Limit
  const limitParam =
    Number.parseInt(searchParams.get("limit") ?? "", 10) || PAGE_LIMITS.SM;
  const limit = isValidLimit(limitParam) ? limitParam : PAGE_LIMITS.SM;

  //   Role
  const roleParam = searchParams.get("role");
  const role = isValidRole(roleParam) ? roleParam : undefined;

  // isActive
  const isActiveParam = searchParams.get("isActive");
  const isActive =
    isActiveParam === "true"
      ? true
      : isActiveParam === "false"
        ? false
        : undefined;

  // isUsed
  const isUsedParam = searchParams.get("used");
  const isExpiredParam = searchParams.get("expired");
  const isUsed =
    isUsedParam === "true" ? true : isUsedParam === "false" ? false : undefined;

  // isExpired
  const isExpired =
    isExpiredParam === "true"
      ? true
      : isExpiredParam === "false"
        ? false
        : undefined;

  // Tab
  const tabParam = searchParams.get("tab");
  const activeTab = Object.values(Tab).includes(tabParam as Tab)
    ? (tabParam as Tab)
    : Tab.STAFF;

  // Set Tab Function
  const setActiveTab = (value: Tab) => {
    const params = new URLSearchParams(searchParams.toString());
    const key = "tab";
    if (value) {
      params.set(key, value);
      params.set("page", "1");
      if (value === Tab.STAFF) {
        params.delete("used");
        params.delete("expired");
      } else {
        params.delete("role");
        params.delete("isActive");
      }
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Page
  const pageParam = searchParams.get("page");
  const page = Number.parseInt(pageParam ?? "1", 10) || 1;

  return {
    search,
    limit,
    role,
    isActive,
    isUsed,
    isExpired,
    activeTab,
    page,
    setActiveTab,
  };
}
