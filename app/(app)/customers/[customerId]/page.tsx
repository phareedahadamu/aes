import { verifyPageAccess } from "@/lib/dal/accessControl";
import CustomerDetailsPageContent from "./content";
import { Suspense } from "react";
import FullPageLoader from "@/components/web/loaders-and-skeletons/fullPageLoader";
import PageHeader from "@/components/web/pageHeader";
import AddEditPropertyModal from "@/components/web/properties/addPropertiesModal";

export default async function CustomerDetailsPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;
  await verifyPageAccess("Customers");
  return (
    <Suspense fallback={<FullPageLoader />}>
      <section className="flex flex-col w-full gap-2">
        <PageHeader
          title={"Customer profile"}
          description={"Manage and update customer profile."}
          actionButton={
            <AddEditPropertyModal
              action="add"
              origin="customerDetailsPage"
              ownerId={customerId}
            />
          }
        />
        <CustomerDetailsPageContent customerId={customerId} />
      </section>
    </Suspense>
  );
}
