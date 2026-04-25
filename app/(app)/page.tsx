import { verifyPageAccess } from "@/lib/dal/accessControl";
export default async function AppDashboard() {
  await verifyPageAccess("Dashboard");
  return <section className="flex-1 p-4">Welcome to the dashboard!</section>;
}
