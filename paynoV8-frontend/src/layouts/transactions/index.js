import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function TransactionPage() {
  const [alert, setAlert] = useState({ show: false, color: "info", message: "" });
  const [walletBalance, setWalletBalance] = useState(0);

  // Deposit and Withdraw State
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // Send Money State
  const [sendAmount, setSendAmount] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");

  // Split Bill State
  const [splitBeneficiary, setSplitBeneficiary] = useState("");
  const [splitAmount, setSplitAmount] = useState("");
  const [splitContributorInput, setSplitContributorInput] = useState("");
  const [splitContributors, setSplitContributors] = useState([]);
  const [payingCircle, setPayingCircle] = useState([]);

  useEffect(() => {
    // Load wallet balance and paying circle from localStorage for demo
    const balance = parseFloat(localStorage.getItem("walletBalance") || "281000");
    setWalletBalance(balance);

    const circles = JSON.parse(localStorage.getItem("payingCircles") || "[]");
    const allMembers = new Set();
    circles.forEach(circle => {
      circle.members.forEach(member => allMembers.add(member.id));
    });
    setPayingCircle(Array.from(allMembers));
  }, []);

  const showAlert = (color, message) => {
    setAlert({ show: true, color, message });
    setTimeout(() => setAlert({ show: false, color: "info", message: "" }), 5000);
  };

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) {
      showAlert("error", "Please enter a valid amount to deposit.");
      return;
    }

    const newBalance = walletBalance + amount;
    localStorage.setItem("walletBalance", newBalance.toString());
    setWalletBalance(newBalance);

    const transactions = JSON.parse(localStorage.getItem("recentTransactions") || "[]");
    const newTransaction = {
      color: "success",
      icon: "arrow_upward",
      name: "Deposit",
      description: new Date().toLocaleDateString("en-US", { day: '2-digit', month: 'short', year: 'numeric' }),
      value: `+ ₦ ${amount.toLocaleString()}`,
    };
    localStorage.setItem("recentTransactions", JSON.stringify([newTransaction, ...transactions].slice(0, 5)));
    window.dispatchEvent(new Event("storage"));

    showAlert("success", `Successfully deposited ₦${amount.toLocaleString()}.`);
    setDepositAmount("");
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      showAlert("error", "Please enter a valid amount to withdraw.");
      return;
    }
    if (amount > walletBalance) {
      showAlert("error", "Insufficient wallet balance.");
      return;
    }

    const newBalance = walletBalance - amount;
    localStorage.setItem("walletBalance", newBalance.toString());
    setWalletBalance(newBalance);

    const transactions = JSON.parse(localStorage.getItem("recentTransactions") || "[]");
    const newTransaction = {
      color: "error",
      icon: "arrow_downward",
      name: "Withdrawal",
      description: new Date().toLocaleDateString("en-US", { day: '2-digit', month: 'short', year: 'numeric' }),
      value: `- ₦ ${amount.toLocaleString()}`,
    };
    localStorage.setItem("recentTransactions", JSON.stringify([newTransaction, ...transactions].slice(0, 5)));
    window.dispatchEvent(new Event("storage"));

    showAlert("success", `Successfully withdrew ₦${amount.toLocaleString()}.`);
    setWithdrawAmount("");
  };

  const handleSendMoney = () => {
    const amount = parseFloat(sendAmount);
    if (!amount || amount <= 0 || !recipientAccount) {
      showAlert("error", "Please enter a valid amount and recipient account.");
      return;
    }
    if (amount > walletBalance) {
      showAlert("error", "Insufficient wallet balance.");
      return;
    }

    const newBalance = walletBalance - amount;
    localStorage.setItem("walletBalance", newBalance.toString());
    setWalletBalance(newBalance);

    // Add to recent transactions
    const transactions = JSON.parse(localStorage.getItem("recentTransactions") || "[]");
    const newTransaction = {
      color: "error",
      icon: "arrow_downward",
      name: `Sent to ${recipientAccount}`,
      description: new Date().toLocaleDateString("en-US", { day: '2-digit', month: 'short', year: 'numeric' }),
      value: `- ₦ ${amount.toLocaleString()}`,
    };
    localStorage.setItem("recentTransactions", JSON.stringify([newTransaction, ...transactions].slice(0, 5)));
    window.dispatchEvent(new Event("storage"));

    showAlert("success", `Successfully sent ₦${amount.toLocaleString()} to ${recipientAccount}.`);
    setSendAmount("");
    setRecipientAccount("");
  };

  const handleAddContributor = () => {
    if (!splitContributorInput.trim()) return;
    const isInCircle = payingCircle.includes(splitContributorInput);
    setSplitContributors(prev => [...prev, { id: splitContributorInput, name: splitContributorInput, isInCircle }]);
    setSplitContributorInput("");
  };

  const handleRemoveContributor = (id) => {
    setSplitContributors(prev => prev.filter(c => c.id !== id));
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {alert.show && (
          <MDBox mb={2}>
            <MDAlert color={alert.color} dismissible>{alert.message}</MDAlert>
          </MDBox>
        )}
        <Grid container spacing={3}>
          {/* Deposit Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <MDBox variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info" p={2} textAlign="center">
                <MDTypography variant="h5" fontWeight="medium" color="white" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon sx={{ mr: 1 }}>add_card</Icon>
                  Deposit
                </MDTypography>
              </MDBox>
              <MDBox p={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <MDInput type="number" label="Amount to Deposit" fullWidth value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
                  </Grid>
                </Grid>
                <MDBox mt={3}>
                  <MDButton variant="gradient" color="info" fullWidth onClick={handleDeposit}>Deposit</MDButton>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>

          {/* Withdraw Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <MDBox variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info" p={2} textAlign="center">
                <MDTypography variant="h5" fontWeight="medium" color="white" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon sx={{ mr: 1 }}>money_off</Icon>
                  Withdraw
                </MDTypography>
              </MDBox>
              <MDBox p={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <MDInput type="number" label="Amount to Withdraw" fullWidth value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} />
                  </Grid>
                </Grid>
                <MDBox mt={3}>
                  <MDButton variant="gradient" color="info" fullWidth onClick={handleWithdraw}>Withdraw</MDButton>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>

          {/* Send Money Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <MDBox variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info" p={2} textAlign="center">
                <MDTypography variant="h5" fontWeight="medium" color="white" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon sx={{ mr: 1 }}>send</Icon>
                  Send Money
                </MDTypography>
              </MDBox>
              <MDBox p={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <MDInput label="Recipient Account Number" fullWidth value={recipientAccount} onChange={(e) => setRecipientAccount(e.target.value)} />
                  </Grid>
                  <Grid item xs={12}>
                    <MDInput type="number" label="Amount" fullWidth value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} />
                  </Grid>
                </Grid>
                <MDBox mt={3}>
                  <MDButton variant="gradient" color="info" fullWidth onClick={handleSendMoney}>Send</MDButton>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>

          {/* Split Bill Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <MDBox variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info" p={2} textAlign="center">
                <MDTypography variant="h5" fontWeight="medium" color="white" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon sx={{ mr: 1 }}>call_split</Icon>
                  Split a Bill
                </MDTypography>
              </MDBox>
              <MDBox p={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <MDInput label="Beneficiary Name" fullWidth value={splitBeneficiary} onChange={(e) => setSplitBeneficiary(e.target.value)} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <MDInput type="number" label="Total Amount" fullWidth value={splitAmount} onChange={(e) => setSplitAmount(e.target.value)} />
                  </Grid>
                  <Grid item xs={12}>
                    <MDBox display="flex" alignItems="center">
                      <MDInput label="Add Contributor Account" fullWidth value={splitContributorInput} onChange={(e) => setSplitContributorInput(e.target.value)} />
                      <MDButton variant="text" color="info" onClick={handleAddContributor}>Add</MDButton>
                    </MDBox>
                  </Grid>
                </Grid>

                {splitContributors.length > 0 && (
                  <MDBox mt={2}>
                    <MDTypography variant="subtitle2">
                      Amount per person: ₦{splitAmount && splitContributors.length > 0 ? (parseFloat(splitAmount) / splitContributors.length).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                    </MDTypography>
                    <List>
                      {splitContributors.map((c) => (
                        <ListItem key={c.id} secondaryAction={
                          <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveContributor(c.id)}>
                            <Icon color="error">delete</Icon>
                          </IconButton>
                        }>
                          <ListItemText
                            primary={
                              <MDBox display="flex" alignItems="center">
                                <MDTypography variant="button" fontWeight="medium">{c.name}</MDTypography>
                                {c.isInCircle && <Icon color="success" sx={{ ml: 1 }}>check_circle</Icon>}
                              </MDBox>
                            }
                            secondary={!c.isInCircle &&
                              <MDBox display="flex" alignItems="center" mt={0.5}>
                                <MDTypography variant="caption" color="error">Not in paying circle</MDTypography>
                                <MDButton variant="text" color="info" size="small" sx={{ ml: 1, textTransform: 'none' }}>Invite Now</MDButton>
                              </MDBox>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </MDBox>
                )}

                <MDBox mt={3}>
                  <MDButton variant="gradient" color="info" fullWidth onClick={() => showAlert("info", "Split Bill feature is for UI demo.")}>
                    Split Bill
                  </MDButton>
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

export default TransactionPage;