import { verifyPageAccess } from "@/lib/dal/accessControl";
import PageHeader from "@/components/web/pageHeader";
import ServiceAreasPageContent from "./content";
import AddEditWardModal from "@/components/web/service-areas/addEditWardModal";
import { Suspense } from "react";
import FullPageLoader from "@/components/web/loaders-and-skeletons/fullPageLoader";
export default async function ServiceAreasPage() {
  await verifyPageAccess("Service Areas");
  return (
    <Suspense fallback={<FullPageLoader />}>
      <section className="flex flex-col w-full gap-2">
        <PageHeader
          title={"Service Areas"}
          description={
            "Oversee all  wards and streets within the your service network."
          }
          actionButton={<AddEditWardModal action="add" />}
        />
        <ServiceAreasPageContent />
      </section>
    </Suspense>
  );
}
