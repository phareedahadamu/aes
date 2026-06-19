import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/app/getQueryClient";
import {
  getStaffStats,
  getPaginatedStaff,
  getPaginatedInvitations,
} from "@/lib/dal/staff/getStaff";
import StaffStats from "@/components/web/staff/staffStats";
import StaffAndInvitations from "@/components/web/staff/staffAndInvitations";
import {
  STAFF_METRICS_QKEY,
  ALL_STAFF_QKEY,
  ALL_INVITATIONS_QKEY,
  PAGE_LIMITS,
} from "@/lib/constants/general";
import { Suspense } from "react";
import SearchBarWrapped from "@/components/web/inputsAndFilters/searchBarWrapped";
import StaffInvitationsFilter from "@/components/web/staff/staffInvitationsFilter";
import Loader from "@/components/web/loaders-and-skeletons/loader";

export default async function StaffPageContent() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [STAFF_METRICS_QKEY],
    queryFn: getStaffStats,
  });

  const staffPayload = {
    page: 1,
    limit: PAGE_LIMITS.SM,
    emailQuery: undefined,
    isActive: undefined,
    role: undefined,
  };
  await queryClient.prefetchQuery({
    queryKey: [ALL_STAFF_QKEY, staffPayload],
    queryFn: () => getPaginatedStaff(staffPayload),
  });

  const invitationsPayload = {
    page: 1,
    limit: PAGE_LIMITS.SM,
    emailQuery: undefined,
    isUsed: undefined,
    isExpired: undefined,
  };
  await queryClient.prefetchQuery({
    queryKey: [ALL_INVITATIONS_QKEY, invitationsPayload],
    queryFn: () => getPaginatedInvitations(invitationsPayload),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className="w-full flex flex-col gap-4.5">
        <StaffStats />
        <section className="bg-background rounded-mid border border-border w-full p-4 flex flex-col gap-8">
          <div className="w-full flex gap-3 items-center">
            <SearchBarWrapped placeholder="Search by email" />
            <StaffInvitationsFilter />
          </div>
          <Suspense
            fallback={
              <div className="w-full flex justify-center py-10">
                <Loader />
              </div>
            }
          >
            <StaffAndInvitations />
          </Suspense>
        </section>
      </section>
    </HydrationBoundary>
  );
}
