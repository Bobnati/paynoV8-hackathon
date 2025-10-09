

// @mui material components
import Grid from "@mui/material/Grid";

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Transactions from "layouts/dashboard/components/Transactions";

import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;

  const userData = JSON.parse(localStorage.getItem("authData"));
  const user = userData.user;
  console.log(userData)

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
                count="₦281,000"              // Added currency symbol
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
                count="0123456789"            // Changed to account number format
                percentage={{
                  color: "success",
                  amount: "",
                  label: "User ID: PAY123",   // Added user ID
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
                count="₦34,000"               // Added currency symbol
                percentage={{
                  color: "success",
                  amount: "+1%",
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
                title="Paying Circle"          // Changed from Followers
                count="91"                     // Kept the number
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
                  count="N234,000"
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
                    label: "pending settlements"
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ComplexStatisticsCard
                  color="primary"
                  icon="paid"
                  title="Recent Transactions"
                  count="12"
                  percentage={{
                    color: "success",
                    amount: "+3",
                    label: "in the last 24 hours"
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
