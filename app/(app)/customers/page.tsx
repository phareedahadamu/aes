import { verifyPageAccess } from "@/lib/dal/accessControl";
import PageHeader from "@/components/web/pageHeader";
import AddEditCustomerModal from "@/components/web/customers/addEditCustomerModal";
import CustomerPageContent from "./content";
import FullPageLoader from "@/components/web/loaders-and-skeletons/fullPageLoader";
import { Suspense } from "react";
export default async function CustomersPage() {
  await verifyPageAccess("Customers");
  return (
    <Suspense fallback={<FullPageLoader />}>
      <section className="flex flex-col w-full gap-2">
        <PageHeader
          title={"Customers"}
          description={"Manage your customer directory."}
          actionButton={<AddEditCustomerModal action="add" />}
        />
        <CustomerPageContent />
      </section>
    </Suspense>
  );
}
