import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/app/getQueryClient";
import {
  PAGE_LIMITS,
  CUSTOMER_BY_ID_QKEY,
  CUSTOMER_PROFILE_STATS_QKEY,
  CUSTOMER_PROPERTIES_QKEY,
} from "@/lib/constants/general";
import { Suspense } from "react";
import SearchBarWrapped from "@/components/web/inputsAndFilters/searchBarWrapped";
import Loader from "@/components/web/loaders-and-skeletons/loader";
import {
  getCustomerById,
  getCustomerStats,
} from "@/lib/dal/customers/getCustomers";
import { getPaginatedCustomersProperties } from "@/lib/dal/customers/getCustomersProperties";
import CustomerProfileStats from "@/components/web/customers/customerProfileStats";
import CustomerDetailsCard from "@/components/web/customers/customerDetailsCard";
import CustomersPropertiesTable from "@/components/web/customers/customersPropertiesTable";
import CustomerPropertiesFilter from "@/components/web/customers/customerProperiesFilter";
import ExportButton from "@/components/web/export/exportButton";
import PageHeader from "@/components/web/pageHeader";
import AddPropertyWrapper from "@/components/web/properties/addPropertyWrapper";

export default async function CustomerDetailsPageContent({
  customerId,
}: {
  customerId: string;
}) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [CUSTOMER_BY_ID_QKEY, { customerId }],
    queryFn: () => getCustomerById({ customerId }),
  });

  await queryClient.prefetchQuery({
    queryKey: [CUSTOMER_PROFILE_STATS_QKEY, { customerId }],
    queryFn: () => getCustomerStats({ customerId }),
  });

  const payload = {
    page: 1,
    limit: PAGE_LIMITS.SM,
    searchQuery: undefined,
    isActive: undefined,
    id: customerId,
  };
  await queryClient.prefetchQuery({
    queryKey: [CUSTOMER_PROPERTIES_QKEY, { customerId }],
    queryFn: () => getPaginatedCustomersProperties(payload),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PageHeader
        title={"Customer profile"}
        description={"Manage and update customer profile."}
        actionButton={<AddPropertyWrapper customerId={customerId} />}
      />
      <section className="w-full flex flex-col gap-4.5">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3 items-center">
          <CustomerDetailsCard customerId={customerId} />
          <CustomerProfileStats customerId={customerId} />
        </div>

        <section className="bg-background rounded-mid border border-border w-full p-4 flex flex-col gap-8">
          <div className="flex w-full items-center justify-between">
            <div className="w-full flex gap-3 items-center">
              <SearchBarWrapped placeholder="Search by code or name" />
              <CustomerPropertiesFilter />
            </div>
            <ExportButton
              category="properties-for-customer"
              title="Customer Properties"
              id={customerId}
            />
          </div>
          <Suspense
            fallback={
              <div className="w-full flex justify-center py-10">
                <Loader />
              </div>
            }
          >
            <CustomersPropertiesTable id={customerId} />
          </Suspense>
        </section>
      </section>
    </HydrationBoundary>
  );
}
