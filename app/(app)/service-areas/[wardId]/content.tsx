import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/app/getQueryClient";
import { getPaginatedStreets } from "@/lib/dal/service-areas/streets/getStreets";
import {
  PAGE_LIMITS,
  ALL_STREETS_QKEY,
  WARD_BY_ID_QKEY,
} from "@/lib/constants/general";
import { Suspense } from "react";
import SearchBarWrapped from "@/components/web/inputsAndFilters/searchBarWrapped";
import Loader from "@/components/web/loaders-and-skeletons/loader";
import StreetsTable from "@/components/web/service-areas/streets/streetsTable";
import { getWardById } from "@/lib/dal/service-areas/getServiceAreas";
import WardDetailsCard from "@/components/web/service-areas/wardDetailsCard";
import StreetsFilter from "@/components/web/service-areas/streets/streetsFilter";
import ExportButton from "@/components/web/export/exportButton";

export default async function WardPageContent({ wardId }: { wardId: string }) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [WARD_BY_ID_QKEY, { wardId }],
    queryFn: () => getWardById({ wardId }),
  });

  const payload = {
    page: 1,
    limit: PAGE_LIMITS.SM,
    searchQuery: undefined,
    isActive: undefined,
    wardId,
  };
  await queryClient.prefetchQuery({
    queryKey: [ALL_STREETS_QKEY, payload],
    queryFn: () => getPaginatedStreets(payload),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className="w-full flex flex-col gap-4.5">
        <WardDetailsCard wardId={wardId} />
        <section className="bg-background rounded-mid border border-border w-full p-4 flex flex-col gap-8">
          <div className="flex w-full items-center justify-between">
            <div className="w-full flex gap-3 items-center">
              <SearchBarWrapped placeholder="Search by code or name" />
              <StreetsFilter />
            </div>
            <ExportButton
              category="streets-in-ward"
              title="Streets"
              id={wardId}
            />
          </div>

          <Suspense
            fallback={
              <div className="w-full flex justify-center py-10">
                <Loader />
              </div>
            }
          >
            <StreetsTable wardId={wardId} />
          </Suspense>
        </section>
      </section>
    </HydrationBoundary>
  );
}
