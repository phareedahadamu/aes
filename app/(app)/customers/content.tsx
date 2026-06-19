import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/app/getQueryClient";
import { ALL_CUSTOMERS_QKEY, PAGE_LIMITS } from "@/lib/constants/general";
import { Suspense } from "react";
import SearchBarWrapped from "@/components/web/inputsAndFilters/searchBarWrapped";
import Loader from "@/components/web/loaders-and-skeletons/loader";
import CustomersTable from "@/components/web/customers/customersTable";
import { getPaginatedCustomers } from "@/lib/dal/customers/getCustomers";
import ExportButton from "@/components/web/export/exportButton";

export default async function CustomerPageContent() {
  const queryClient = getQueryClient();

  const payload = {
    page: 1,
    limit: PAGE_LIMITS.SM,
    searchQuery: undefined,
  };
  await queryClient.prefetchQuery({
    queryKey: [ALL_CUSTOMERS_QKEY, payload],
    queryFn: () => getPaginatedCustomers(payload),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className="w-full flex flex-col gap-4.5">
        <section className="bg-background rounded-mid border border-border w-full p-4 flex flex-col gap-8">
          <div className="flex w-full items-center justify-between">
            <div className="w-full flex gap-3 items-center">
              <SearchBarWrapped placeholder="Search by name or email" />
            </div>
            <ExportButton category="customers" title="Customers" />
          </div>
          <Suspense
            fallback={
              <div className="w-full flex justify-center py-10">
                <Loader />
              </div>
            }
          >
            <CustomersTable />
          </Suspense>
        </section>
      </section>
    </HydrationBoundary>
  );
}
