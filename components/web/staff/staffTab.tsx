"use client";

import StaffTable from "./staffTable";
import { Role } from "@/generated/prisma/enums";
import { normalizeText } from "@/lib/utils";
import SearchResultFilterText from "../inputsAndFilters/searchResultFilterText";
import { PAGE_LIMITS } from "@/lib/constants/general";

export default function StaffTab({
  page,
  emailQuery,
  isActive,
  role,
  limit,
}: {
  page: number;
  emailQuery: string | undefined;
  isActive: boolean | undefined;
  role: Role | undefined;
  limit: PAGE_LIMITS;
}) {
  function getActiveFilters() {
    const activeFilters: string[] = [];
    if (role) {
      activeFilters.push(normalizeText(role));
    }
    if (typeof isActive === "boolean" && !isActive) {
      activeFilters.push("Disabled");
    }
    if (isActive) {
      activeFilters.push("Active");
    }
    return activeFilters;
  }

  return (
    <section className="flex flex-col gap-6">
      <SearchResultFilterText
        searchQuery={emailQuery}
        filters={getActiveFilters()}
      />
      <StaffTable
        page={page}
        isActive={isActive}
        role={role}
        emailQuery={emailQuery}
        limit={limit}
      />
    </section>
  );
}
