"use client";
import SearchResultFilterText from "../inputsAndFilters/searchResultFilterText";
import InvitationsTable from "./invitationsTable";
import { PAGE_LIMITS } from "@/lib/constants/general";
import { getActiveFilters } from "@/lib/utils";
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
  return (
    <section className="flex flex-col gap-6">
      <SearchResultFilterText
        searchQuery={emailQuery}
        filters={getActiveFilters({ isUsed, isExpired })}
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
