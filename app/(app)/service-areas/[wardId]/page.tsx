import { verifyPageAccess } from "@/lib/dal/accessControl";
import WardPageContent from "./content";
import { Suspense } from "react";
import FullPageLoader from "@/components/web/loaders-and-skeletons/fullPageLoader";
import AddEditStreetModal from "@/components/web/service-areas/streets/addEditStreetModal";
import PageHeader from "@/components/web/pageHeader";
export default async function StreetsPage({
  params,
}: {
  params: Promise<{ wardId: string }>;
}) {
  const { wardId } = await params;
  await verifyPageAccess("Service Areas");
  return (
    <Suspense fallback={<FullPageLoader />}>
      <section className="flex flex-col w-full gap-2">
        <PageHeader
          title={"Ward"}
          description={`Manage all streets within a ward`}
          actionButton={<AddEditStreetModal action="add" wardId={wardId} />}
        />
        <WardPageContent wardId={wardId} />
      </section>
    </Suspense>
  );
}
