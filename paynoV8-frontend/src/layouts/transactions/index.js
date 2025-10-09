import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Transaction from "./components/Transaction";

function TransactionPage() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Transaction />
    </DashboardLayout>
  );
}

export default TransactionPage;