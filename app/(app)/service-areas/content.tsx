import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/app/getQueryClient";
import {
  getServiceAreasStats,
  getPaginatedServiceAreas,
} from "@/lib/dal/service-areas/getServiceAreas";
import {
  PAGE_LIMITS,
  SERVICE_AREAS_METRICS_QKEY,
  ALL_SERVICE_AREAS_QKEY,
} from "@/lib/constants/general";
import { Suspense } from "react";
import SearchBarWrapped from "@/components/web/inputsAndFilters/searchBarWrapped";
import ServiceAreasStats from "@/components/web/service-areas/serviceAreasStats";
import ServiceAreasFilter from "@/components/web/service-areas/serviceAreasFilter";
import Loader from "@/components/web/loaders-and-skeletons/loader";
import ServiceAreasTable from "@/components/web/service-areas/serviceAreasTable";
import ExportButton from "@/components/web/export/exportButton";

export default async function ServiceAreasPageContent() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [SERVICE_AREAS_METRICS_QKEY],
    queryFn: getServiceAreasStats,
  });
  const payload = {
    page: 1,
    limit: PAGE_LIMITS.SM,
    searchQuery: undefined,
    isActive: undefined,
  };
  await queryClient.prefetchQuery({
    queryKey: [ALL_SERVICE_AREAS_QKEY, payload],
    queryFn: () => getPaginatedServiceAreas(payload),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className="w-full flex flex-col gap-4.5">
        <ServiceAreasStats />
        <section className="bg-background rounded-mid border border-border w-full p-4 flex flex-col gap-8">
          <div className="flex w-full items-center justify-between">
            <div className="w-full flex gap-3 items-center">
              <SearchBarWrapped placeholder="Search by code or name" />
              <ServiceAreasFilter />
            </div>
            <ExportButton category="wards" title="Service Areas" />
          </div>
          <Suspense
            fallback={
              <div className="w-full flex justify-center py-10">
                <Loader />
              </div>
            }
          >
            <ServiceAreasTable />
          </Suspense>
        </section>
      </section>
    </HydrationBoundary>
  );
}
