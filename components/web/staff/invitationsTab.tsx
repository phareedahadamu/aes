"use client";
import SearchResultFilterText from "../inputsAndFilters/searchResultFilterText";
import InvitationsTable from "./invitationsTable";
import { PAGE_LIMITS } from "@/lib/constants/general";
export default function InvitationsTab({
  page,
  emailQuery,
  isUsed,
  isExpired,
  limit,
}: {
  page: number;
  emailQuery: string | undefined;
  isUsed: boolean | undefined;
  isExpired: boolean | undefined;
  limit: PAGE_LIMITS;
}) {
  function getActiveFilters() {
    const activeFilters: string[] = [];

    if (typeof isUsed === "boolean" && !isUsed) {
      activeFilters.push("Unused");
    }
    if (isUsed) {
      activeFilters.push("Used");
    }
    if (typeof isExpired === "boolean" && !isExpired) {
      activeFilters.push("Active");
    }
    if (isExpired) {
      activeFilters.push("Expired");
    }
    return activeFilters;
  }
  return (
    <section className="flex flex-col gap-6">
      <SearchResultFilterText
        searchQuery={emailQuery}
        filters={getActiveFilters()}
      />

      <InvitationsTable
        page={page}
        isUsed={isUsed}
        isExpired={isExpired}
        emailQuery={emailQuery}
        limit={limit}
      />
    </section>
  );
}
