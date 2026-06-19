import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/app/getQueryClient";
import {
  getPropertyUnitsStats,
  getPaginatedPropertyUnits,
} from "@/lib/dal/property-units/getPropertyUnits";
import {
  PROPERTY_UNITS_METRICS_QKEY,
  ALL_PROPERTY_UNITS_QKEY,
  PAGE_LIMITS,
} from "@/lib/constants/general";
import { Suspense } from "react";
import SearchBarWrapped from "@/components/web/inputsAndFilters/searchBarWrapped";
import PropertyUnitsStats from "@/components/web/propertyUnits/propertyUnitsStats";
import PropertyUnitsFilter from "@/components/web/propertyUnits/propertyUnitsFilter";
import Loader from "@/components/web/loaders-and-skeletons/loader";
import PropertyUnitsTable from "@/components/web/propertyUnits/propertyUnitsTable";

export default async function PropertyUnitsPageContent() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [PROPERTY_UNITS_METRICS_QKEY],
    queryFn: getPropertyUnitsStats,
  });
  const payload = {
    page: 1,
    limit: PAGE_LIMITS.SM,
    searchQuery: undefined,
    isActive: undefined,
  };
  await queryClient.prefetchQuery({
    queryKey: [ALL_PROPERTY_UNITS_QKEY, payload],
    queryFn: () => getPaginatedPropertyUnits(payload),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className="w-full flex flex-col gap-4.5">
        <PropertyUnitsStats />
        <section className="bg-background rounded-mid border border-border w-full p-4 flex flex-col gap-8">
          <div className="w-full flex gap-3 items-center">
            <SearchBarWrapped placeholder="Search by code or name" />
            <PropertyUnitsFilter />
          </div>
          <Suspense
            fallback={
              <div className="w-full flex justify-center py-10">
                <Loader />
              </div>
            }
          >
            <PropertyUnitsTable />
          </Suspense>
        </section>
      </section>
    </HydrationBoundary>
  );
}
