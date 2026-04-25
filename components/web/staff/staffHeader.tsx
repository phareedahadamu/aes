import InviteStaffButton from "./inviteStaffButton";
export default function StaffHeader() {
  return (
    <header className="flex w-full justify-between items-center">
      <div className="flex flex-col gap-1.5">
        <h2 className="font-medium text-2xl">Staff Management</h2>
        <p className="text-muted-foreground">Manage Staff Access</p>
      </div>
      <InviteStaffButton />
    </header>
  );
}
