import StaffPageContent from "./content";
import { verifyPageAccess } from "@/lib/dal/accessControl";
import PageHeader from "@/components/web/pageHeader";
import InviteStaffModal from "@/components/web/staff/inviteStaffModal";
import FullPageLoader from "@/components/web/loaders-and-skeletons/fullPageLoader";
import { Suspense } from "react";
export default async function StaffPage() {
  await verifyPageAccess("Staff");
  return (
    <Suspense fallback={<FullPageLoader />}>
      <section className="flex flex-col w-full gap-2">
        <PageHeader
          title={"Staff Management"}
          description={"Manage Staff Access"}
          actionButton={<InviteStaffModal />}
        />
        <StaffPageContent />
      </section>
    </Suspense>
  );
}
