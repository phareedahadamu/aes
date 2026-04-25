import StaffHeader from "@/components/web/staff/staffHeader";
import StaffPageContent from "./content";
import { verifyPageAccess } from "@/lib/dal/accessControl";
export default async function StaffPage() {
  await verifyPageAccess("Staff");
  return (
    <section className="flex flex-col w-full gap-2">
      <StaffHeader />
      <StaffPageContent />
    </section>
  );
}
