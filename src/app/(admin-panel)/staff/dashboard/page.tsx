import { Navbar } from "@/components/admin-panel/navbar";
import { getSalesData } from "@/services/sales";
import StaffDashboard from "./dashboard";

export default async function StaffDashboardPage() {
  const salesData = await getSalesData({});

  return (
    <>
      <Navbar title="Dashboard" />
      <StaffDashboard salesData={salesData} />
    </>
  );
}
