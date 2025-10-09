

// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Switch from "@mui/material/Switch";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
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
import { useState, useEffect } from "react";
import MDAlert from "components/MDAlert";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import { FormControl, InputLabel } from "@mui/material";

function Savings() {
  const [aiAssisted, setAiAssisted] = useState(false);
  const [manualAmount, setManualAmount] = useState("");
  const [alert, setAlert] = useState({ show: false, color: "info", message: "" });
  const [rules, setRules] = useState(() => {
    const savedRules = localStorage.getItem("savingsRules");
    return savedRules ? JSON.parse(savedRules) : [
      { id: 1, type: "Recurring", description: "Save ₦5,000 Weekly", saved: 45000 },
      { id: 2, type: "Transaction Keyword", description: 'Save 10% on "Uber"', saved: 12500 },
    ];
  });

  useEffect(() => {
    localStorage.setItem("savingsRules", JSON.stringify(rules));
  }, [rules]);

  const [transactionKeyword, setTransactionKeyword] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionPercentage, setTransactionPercentage] = useState("");

  const [eventTeam, setEventTeam] = useState("");
  const [eventAmount, setEventAmount] = useState("");

  const premierLeagueTeams = [
    "Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton", "Chelsea",
    "Crystal Palace", "Everton", "Fulham", "Ipswich Town", "Leicester City", "Liverpool",
    "Manchester City", "Manchester United", "Newcastle United", "Nottingham Forest",
    "Southampton", "Tottenham Hotspur", "West Ham United", "Wolverhampton"
  ];

  const handleSaveNow = () => {
    const amount = parseFloat(manualAmount);
    if (!amount || amount <= 0) {
      setAlert({ show: true, color: "error", message: "Please enter a valid amount." });
      return;
    }

    const currentWalletBalance = parseFloat(localStorage.getItem("walletBalance") || "281000");
    if (amount > currentWalletBalance) {
      setAlert({ show: true, color: "error", message: "Insufficient wallet balance." });
      return;
    }

    // For demo: update localStorage which the dashboard reads
    const newWalletBalance = currentWalletBalance - amount;
    const currentSavings = parseFloat(localStorage.getItem("savingsBalance") || "34000");
    const currentLifetime = parseFloat(localStorage.getItem("lifetimeSavings") || "234000");

    const newSavings = currentSavings + amount;
    const newLifetime = currentLifetime + amount;

    localStorage.setItem("walletBalance", newWalletBalance.toString());
    localStorage.setItem("savingsBalance", newSavings.toString());
    localStorage.setItem("lifetimeSavings", newLifetime.toString());
    // Trigger storage event for other tabs (like the dashboard)
    window.dispatchEvent(new Event("storage"));

    const transactions = JSON.parse(localStorage.getItem("recentTransactions") || "[]");
    const newTransaction = {
      color: "error",
      icon: "arrow_downward",
      name: "Manual Savings",
      description: new Date().toLocaleDateString("en-US", { day: '2-digit', month: 'short', year: 'numeric' }),
      value: `- ₦ ${amount.toLocaleString()}`,
    };
    localStorage.setItem("recentTransactions", JSON.stringify([newTransaction, ...transactions].slice(0, 5)));

    setAlert({ show: true, color: "success", message: `Successfully saved ₦${amount.toLocaleString()}.` });
    setManualAmount("");

    setTimeout(() => {
      setAlert({ show: false, color: "info", message: "" });
    }, 3000);
  };

  const handleAiAssistedChange = () => setAiAssisted(!aiAssisted);

  const handleAddTransactionRule = () => {
    if (!transactionKeyword) {
      setAlert({ show: true, color: "error", message: "Please enter a keyword." });
      return;
    }
    const amount = parseFloat(transactionAmount);
    const percentage = parseFloat(transactionPercentage);
    if (!amount && !percentage) {
      setAlert({ show: true, color: "error", message: "Please enter an amount or percentage." });
      return;
    }

    const description = percentage
      ? `Save ${percentage}% on "${transactionKeyword}"`
      : `Save ₦${amount.toLocaleString()} on "${transactionKeyword}"`;

    const newRule = { id: Date.now(), type: "Transaction Keyword", description, saved: 0 };
    setRules((prev) => [...prev, newRule]);
    setTransactionKeyword("");
    setTransactionAmount("");
    setTransactionPercentage("");
    setAlert({ show: true, color: "success", message: "Transaction rule added!" });
  };

  const handleAddEventRule = () => {
    if (!eventTeam) {
      setAlert({ show: true, color: "error", message: "Please select a team." });
      return;
    }
    const amount = parseFloat(eventAmount);
    if (!amount || amount <= 0) {
      setAlert({ show: true, color: "error", message: "Please enter a valid amount per goal." });
      return;
    }

    const description = `Save ₦${amount.toLocaleString()} every time ${eventTeam} scores`;
    const newRule = { id: Date.now(), type: "Goal-based Event", description, saved: 0 };
    setRules((prev) => [...prev, newRule]);
    setEventTeam("");
    setEventAmount("");
    setAlert({ show: true, color: "success", message: "Event rule added!" });
  };

  const handleRemoveRule = (ruleId) => setRules((prev) => prev.filter((rule) => rule.id !== ruleId));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {alert.show && (
          <MDBox mb={2}>
            <MDAlert color={alert.color} dismissible>{alert.message}</MDAlert>
          </MDBox>
        )}
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
                      <MDInput type="number" label="Amount" fullWidth value={manualAmount} onChange={(e) => setManualAmount(e.target.value)} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDInput type="text" label="Currency" value="NGN" disabled fullWidth />
                    </Grid>
                  </Grid>
                  <MDBox mt={4} mb={1}>
                    <MDButton variant="gradient" color="info" fullWidth onClick={handleSaveNow}>
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
                      <MDInput
                        label="Keyword (e.g., allowance)"
                        fullWidth
                        value={transactionKeyword}
                        onChange={(e) => setTransactionKeyword(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <MDInput
                        type="number"
                        label="Amount to Save"
                        fullWidth
                        value={transactionAmount}
                        onChange={(e) => setTransactionAmount(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <MDInput
                        label="Or Percentage (%)"
                        type="number"
                        fullWidth
                        value={transactionPercentage}
                        onChange={(e) => setTransactionPercentage(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                  <MDBox mt={2}>
                    <MDButton variant="gradient" color="secondary" fullWidth onClick={handleAddTransactionRule}>
                      Add Savings Rule
                    </MDButton>
                  </MDBox>
                </MDBox>

                <MDBox my={3} sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }} />

                <MDTypography variant="h6" gutterBottom>
                  Save on Specific Events
                </MDTypography>
                <MDTypography variant="body2" color="text" mb={2}>
                  Automatically save when your favorite team scores a goal.
                </MDTypography>
                <MDBox component="form" role="form">
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth variant="standard">
                        <InputLabel id="team-select-label">Select Premier League Team</InputLabel>
                        <Select
                          labelId="team-select-label"
                          value={eventTeam}
                          onChange={(e) => setEventTeam(e.target.value)}
                        >
                          {premierLeagueTeams.map((team) => (
                            <MenuItem key={team} value={team}>{team}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MDInput
                        type="number"
                        label="Amount to Save per Goal"
                        fullWidth
                        value={eventAmount}
                        onChange={(e) => setEventAmount(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                  <MDTypography variant="caption" color="text" mt={1} display="block">
                    More events coming soon!
                  </MDTypography>
                  <MDBox mt={2}>
                    <MDButton variant="gradient" color="secondary" fullWidth onClick={handleAddEventRule}>
                      Add Event Rule
                    </MDButton>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <MDBox pt={2} px={2}>
                <MDTypography variant="h6">My Savings Rules</MDTypography>
              </MDBox>
              <MDBox p={2}>
                <List>
                  {rules.map((rule, index) => (
                    <ListItem
                      key={rule.id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 1,
                        borderBottom: index < rules.length - 1 ? "1px solid" : "none",
                        borderColor: "divider",
                      }}
                    >
                      <ListItemText
                        primary={<MDTypography variant="button" fontWeight="medium">{rule.description}</MDTypography>}
                        secondary={<MDTypography variant="caption" color="text">{`Type: ${rule.type}`}</MDTypography>}
                      />
                      <MDTypography variant="body2" color="success" sx={{ mx: 2 }}>{`Saved: ₦${rule.saved.toLocaleString()}`}</MDTypography>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveRule(rule.id)}>
                        <Icon color="error">delete</Icon>
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
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
