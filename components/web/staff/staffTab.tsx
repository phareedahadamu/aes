"use client";

import StaffTable from "./staffTable";
import { Role } from "@/generated/prisma/enums";
import { getActiveFilters } from "@/lib/utils";
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
  return (
    <section className="flex flex-col gap-6">
      <SearchResultFilterText
        searchQuery={emailQuery}
        filters={getActiveFilters({ role, isActive })}
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
