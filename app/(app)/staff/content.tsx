import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/app/getQueryClient";
import { getStaffStats } from "@/lib/dal/staff/getStaff";
import StaffStats from "@/components/web/staff/staffStats";

export default async function StaffPageContent() {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["staffStats"],
    queryFn: getStaffStats,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className="w-full flex flex-col gap-4.5">
        <StaffStats />
        <section className="bg-background rounded-mid border border-border w-full p-4 flex flex-col gap-4">
          Staff Page
        </section>
      </section>
    </HydrationBoundary>
  );
}
