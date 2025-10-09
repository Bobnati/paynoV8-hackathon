

// @mui material components
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { useState } from "react";

function Savings() {
  const [aiAssisted, setAiAssisted] = useState(false);

  const handleAiAssistedChange = () => setAiAssisted(!aiAssisted);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} md={8} lg={6}>
            {/* Manual Savings Card */}
            <Card>
              <MDBox
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                p={2}
                textAlign="center"
              >
                <MDTypography variant="h4" fontWeight="medium" color="white">
                  Manual Savings
                </MDTypography>
                <MDTypography display="block" variant="body2" color="white" my={1}>
                  Move funds from your wallet to your locked savings.
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form">
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <MDInput type="number" label="Amount" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDInput type="text" label="Currency" value="NGN" disabled fullWidth />
                    </Grid>
                  </Grid>
                  <MDBox mt={4} mb={1}>
                    <MDButton variant="gradient" color="info" fullWidth>
                      Save Now
                    </MDButton>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>

          <Grid item xs={12} md={8} lg={6}>
            {/* AI-Assisted Savings Card */}
            <Card>
              <MDBox p={2} display="flex" justifyContent="space-between" alignItems="center">
                <MDTypography variant="h6">AI-Assisted Savings</MDTypography>
                <Switch checked={aiAssisted} onChange={handleAiAssistedChange} />
              </MDBox>
              <MDBox p={2}>
                <MDTypography variant="body2" color="text">
                  When enabled, we&apos;ll use your GPS to detect when you are in places like clubs
                  or bars and automatically save a small portion of your income for you. Save while
                  you have fun!
                </MDTypography>
              </MDBox>
            </Card>
          </Grid>

          <Grid item xs={12}>
            {/* Rule-Based Savings Card */}
            <Card>
              <MDBox
                variant="gradient"
                bgColor="secondary"
                borderRadius="lg"
                coloredShadow="secondary"
                p={2}
                textAlign="center"
              >
                <MDTypography variant="h5" fontWeight="medium" color="white">
                  Automated Savings Rules
                </MDTypography>
              </MDBox>
              <MDBox pt={3} pb={3} px={3}>
                <MDTypography variant="h6" gutterBottom>
                  Recurring Savings
                </MDTypography>
                <MDBox display="flex" gap={2} mb={3}>
                  <MDButton variant="outlined" color="info">
                    Save Daily
                  </MDButton>
                  <MDButton variant="outlined" color="info">
                    Save Weekly
                  </MDButton>
                  <MDButton variant="outlined" color="info">
                    Save Monthly
                  </MDButton>
                </MDBox>

                <MDTypography variant="h6" gutterBottom>
                  Save on Specific Transactions
                </MDTypography>
                <MDTypography variant="body2" color="text" mb={2}>
                  Automatically save a percentage or fixed amount when a transaction description
                  matches your set keyword (e.g., &quot;allowance&quot;, &quot;salary&quot;).
                </MDTypography>
                <MDBox component="form" role="form">
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <MDInput label="Keyword (e.g., allowance)" fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <MDInput type="number" label="Amount to Save" fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <MDInput label="Or Percentage (%)" type="number" fullWidth />
                    </Grid>
                  </Grid>
                  <MDBox mt={2}>
                    <MDButton variant="gradient" color="secondary" fullWidth>
                      Add Savings Rule
                    </MDButton>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Savings;
