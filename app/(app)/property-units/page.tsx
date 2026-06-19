import { verifyPageAccess } from "@/lib/dal/accessControl";
import PageHeader from "@/components/web/pageHeader";
import AddEditPropertyUnitsModal from "@/components/web/propertyUnits/addEditPropertyUnitModal";
import PropertyUnitsPageContent from "./content";
import FullPageLoader from "@/components/web/loaders-and-skeletons/fullPageLoader";
import { Suspense } from "react";
export default async function PropertyUnitsPage() {
  await verifyPageAccess("Property Units");
  return (
    <Suspense fallback={<FullPageLoader />}>
      <section className="flex flex-col w-full gap-2">
        <PageHeader
          title={"Property Units"}
          description={"Manage and configure unit types for your properties."}
          actionButton={<AddEditPropertyUnitsModal action="add" />}
        />
        <PropertyUnitsPageContent />
      </section>
    </Suspense>
  );
}
