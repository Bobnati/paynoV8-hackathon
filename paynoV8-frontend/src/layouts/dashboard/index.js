

// @mui material components
import Grid from "@mui/material/Grid";

import { useState, useEffect } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Transactions from "layouts/dashboard/components/Transactions";

import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

function Dashboard() {
  const [walletBalance, setWalletBalance] = useState(() => {
    const saved = localStorage.getItem("walletBalance");
    return saved ? parseFloat(saved) : 281000;
  });
  const [savingsBalance, setSavingsBalance] = useState(() => {
    const saved = localStorage.getItem("savingsBalance");
    return saved ? parseFloat(saved) : 34000;
  });
  const [lifetimeSavings, setLifetimeSavings] = useState(() => {
    const saved = localStorage.getItem("lifetimeSavings");
    return saved ? parseFloat(saved) : 234000;
  });
  const [payingCircleMembers, setPayingCircleMembers] = useState(() => {
    const saved = localStorage.getItem("payingCircleMembers");
    return saved ? parseInt(saved, 10) : 7;
  });
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("loggedInUser") || "Adedamola";
  });

  const formatCurrency = (value) => `₦${new Intl.NumberFormat("en-NG").format(value)}`;

  useEffect(() => {
    const handleStorageChange = () => {
      const loggedInUser = localStorage.getItem("loggedInUser") || "Adedamola";
      setUserName(loggedInUser);

      const savedWallet = localStorage.getItem("walletBalance");
      setWalletBalance(savedWallet ? parseFloat(savedWallet) : 281000);
      const savedSavings = localStorage.getItem("savingsBalance");
      setSavingsBalance(savedSavings ? parseFloat(savedSavings) : 34000);
      const savedLifetime = localStorage.getItem("lifetimeSavings");
      setLifetimeSavings(savedLifetime ? parseFloat(savedLifetime) : 234000);
      const savedMembers = localStorage.getItem("payingCircleMembers");
      setPayingCircleMembers(savedMembers ? parseInt(savedMembers, 10) : 7);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="account_balance_wallet"  // Changed icon to wallet
                title="Wallet Balance"         // Changed from Bookings
                count={formatCurrency(walletBalance)}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="person"                  // Changed icon to person
                title="Account Number"         // Changed from Today's Users
                count="0123456789"
                percentage={{
                  color: "success",
                  amount: "",
                  label: userName,
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="savings"                 // Changed icon to savings
                title="Savings Balance"        // Changed from Revenue
                count={formatCurrency(savingsBalance)}
                percentage={{
                  color: "success",
                  amount: "+8%",
                  label: "interest earned",    // Changed label
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="group"                   // Changed icon to group
                title="Paying Circle"
                count={payingCircleMembers}
                percentage={{
                  color: "success",
                  amount: "+5",
                  label: "new members",        // Changed label
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ComplexStatisticsCard
                  color="success"
                  icon="savings"
                  title="Lifetime Savings"
                  count={formatCurrency(lifetimeSavings)}
                  percentage={{
                    color: "success",
                    amount: "+55%",
                    label: "since last month",
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ComplexStatisticsCard
                  icon="groups"
                  title="Active Bill Splits"
                  count="8"
                  percentage={{
                    color: "success",
                    amount: "3",
                    label: "total bill splits"
                  }}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Transactions />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
