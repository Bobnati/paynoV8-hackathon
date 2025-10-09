import { useState, useEffect, useCallback } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import {
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import MDAlert from "components/MDAlert";
import { CircularProgress } from "@mui/material";
import MDInput from "components/MDInput";

// Data

const baseUrl = "https://paynov8-hackathon-1.onrender.com";

// --- Helper for Mock Data ---
const nigerianNames = [
  "Adewale", "Bolanle", "Chinedu", "Dolapo", "Emeka", "Funmilayo",
  "Gbenga", "Habiba", "Ifeanyi", "Jide", "Kemi", "Lanre",
  "Musa", "Ngozi", "Ola", "Patience", "Rotimi", "Simisola",
  "Tunde", "Uche", "Wale", "Yemi", "Zainab"
];

const getRandomName = () => nigerianNames[Math.floor(Math.random() * nigerianNames.length)];

// --- Mock Data and Functions ---
const initialMockCircles = [
  {
    id: "group1",
    name: "Family",
    members: [
      { id: "user123", name: "You" },
      { id: "user2", name: "Bolanle Adeoye" },
      { id: "user3", name: "Chiamaka Nwosu" },
    ],
  },
  {
    id: "group2",
    name: "Work Colleagues",
    members: [{ id: "user123", name: "You" }, { id: "user4", name: "Emeka Okafor" }],
  },
  {
    id: "group3",
    name: "Vacation Fund",
    members: [
      { id: "user123", name: "You" },
      { id: "user5", name: "Fatima Bello" },
      { id: "user6", name: "Tunde Adebayo" },
      { id: "user7", name: "Ngozi Eze" },
    ],
  },
];

const getMockCircles = () => {
  const saved = localStorage.getItem("payingCircles");
  return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(initialMockCircles)); // Deep copy
};

// API functions
const fetchPayingCircles = async (userId) => {
  console.log("Fetching MOCK circles for userId:", userId);
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = { groups: getMockCircles() };

  // We also need to map the member data to include the avatar images for the UI.
  return data.groups;
};

const addMemberToCircle = async (groupId, memberId) => {
  console.log(`Adding MOCK member ${memberId} to group ${groupId}`);
  // Simulate network delay
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const mockCircles = getMockCircles();
      const circle = mockCircles.find((c) => c.id === groupId);
      if (circle) {
        const newMember = {
          id: memberId,
          name: getRandomName(),
        };
        // Ensure we don't add a duplicate member ID
        if (circle.members.some(m => m.id === newMember.id)) {
          return reject(new Error(`Member with account ${memberId} is already in this circle.`));
        }
        // This part is tricky with mock data. We'll let the UI state handle the update.
        // circle.members.push(newMember);
        resolve({ success: true, message: "Member added successfully" });
      } else {
        reject(new Error("Circle not found."));
      }
    }, 500);
  });
};

const createNewCircle = async (groupName, creatorId) => {
  console.log(`Creating MOCK circle "${groupName}" for creator ${creatorId}`);
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  const mockCircles = getMockCircles();
  // Simulate success
  const newCircle = { id: `group${Date.now()}`, name: groupName, members: [{ id: creatorId, name: "You" }] };
  mockCircles.push(newCircle);
  localStorage.setItem("payingCircles", JSON.stringify(mockCircles));
  return { success: true, group: newCircle };
};

export default function PayingCircles() {
  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCircle, setExpandedCircle] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCircleName, setNewCircleName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [circleToAddTo, setCircleToAddTo] = useState(null);
  const [newMemberAccountNumber, setNewMemberAccountNumber] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [addMemberError, setAddMemberError] = useState(null);
  const [isSplitBillModalOpen, setIsSplitBillModalOpen] = useState(false);
  const [splitBillCircle, setSplitBillCircle] = useState(null);
  const [splitBillAmount, setSplitBillAmount] = useState("");
  const [splitBillContributors, setSplitBillContributors] = useState([]);
  const [isSplitting, setIsSplitting] = useState(false);
  const [splitBillError, setSplitBillError] = useState(null);
  const [splitBillAlert, setSplitBillAlert] = useState({ show: false, color: "info", message: "" });

  // Assume userId is available from auth context or state management
  const userId = "user123"; // Placeholder

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("payingCircles", JSON.stringify(circles));
    }
  }, [circles, loading]);

  const updatePayingCircleCount = (updatedCircles) => {
    const allMembers = new Set();
    updatedCircles.forEach(circle => {
      circle.members.forEach(member => allMembers.add(member.id));
    });
    localStorage.setItem("payingCircleMembers", allMembers.size.toString());
    window.dispatchEvent(new Event("storage"));
  };

  const loadCircles = useCallback(async () => {
    try {
      // Don't show main loader on subsequent reloads, just for the initial fetch
      setLoading(true);
      setError(null);
      const data = await fetchPayingCircles(userId);
      setCircles(data);
      updatePayingCircleCount(data);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const handleCreateCircle = async (e) => {
    e.preventDefault();
    if (!newCircleName.trim()) {
      setCreateError("Circle name cannot be empty.");
      return;
    }
    setIsCreating(true);
    setCreateError(null);
    try {
      await createNewCircle(newCircleName, userId);
      handleCloseCreateCircleModal();
      await loadCircles(); // Refresh the list
    } catch (err) {
      setCreateError(err.message || "Failed to create circle. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberAccountNumber.trim()) {
      setAddMemberError("Account number cannot be empty.");
      return;
    }
    setIsAddingMember(true);
    setAddMemberError(null);
    try {
      await addMemberToCircle(circleToAddTo, newMemberAccountNumber);
      // Manually update the state to reflect the new member for the demo
      // Manually update the state to reflect the new member for the demo
      const updatedCircles = circles.map(c => c.id === circleToAddTo ? { ...c, members: [...c.members, { id: newMemberAccountNumber, name: getRandomName() }] } : c);
      setCircles(updatedCircles);
    } catch (err) {
      setAddMemberError(err.message || "Failed to add member. Please try again.");
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleSplitBill = (e) => {
    e.preventDefault();
    const totalAmount = parseFloat(splitBillAmount);
    if (!totalAmount || totalAmount <= 0 || splitBillContributors.length === 0) {
      setSplitBillError("Please enter a valid amount and ensure there are contributors.");
      return;
    }

    setIsSplitting(true);
    setSplitBillError(null);

    const amountPerPerson = totalAmount / splitBillContributors.length;
    const currentWalletBalance = parseFloat(localStorage.getItem("walletBalance") || "281000");

    if (amountPerPerson > currentWalletBalance) {
      setSplitBillError("Insufficient wallet balance for your share of the split.");
      setIsSplitting(false);
      return;
    }

    const newWalletBalance = currentWalletBalance - amountPerPerson;
    localStorage.setItem("walletBalance", newWalletBalance.toString());

    const transactions = JSON.parse(localStorage.getItem("recentTransactions") || "[]");
    const newTransaction = {
      color: "error",
      icon: "call_split",
      name: `Bill Split for ${splitBillCircle.name}`,
      description: new Date().toLocaleDateString("en-US", { day: '2-digit', month: 'short', year: 'numeric' }),
      value: `- ₦ ${amountPerPerson.toLocaleString()}`,
    };
    localStorage.setItem("recentTransactions", JSON.stringify([newTransaction, ...transactions].slice(0, 5)));
    window.dispatchEvent(new Event("storage"));

    setSplitBillAlert({ show: true, color: "success", message: "Bill split successfully!" });
    handleCloseSplitBillModal();
  };

  const handleRemoveMember = (e, circleId, memberId) => {
    e.stopPropagation();
    const updatedCircles = circles.map(c => {
      if (c.id === circleId) {
        return { ...c, members: c.members.filter(m => m.id !== memberId) };
      }
      return c;
    });
    setCircles(updatedCircles);
    updatePayingCircleCount(updatedCircles);
  };

  useEffect(() => {
    loadCircles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleCircle = (circleId) => {
    setExpandedCircle((prev) => (prev === circleId ? null : circleId));
  };

  const handleOpenCreateCircleModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateCircleModal = () => {
    setIsCreateModalOpen(false);
    setNewCircleName("");
    setCreateError(null);
    setIsCreating(false);
  };

  const handleOpenAddMemberModal = (circleId) => {
    setCircleToAddTo(circleId);
    setIsAddMemberModalOpen(true);
  };

  const handleCloseAddMemberModal = () => {
    setIsAddMemberModalOpen(false);
    setCircleToAddTo(null);
    setNewMemberAccountNumber("");
    setAddMemberError(null);
    setIsAddingMember(false);
  };

  const handleOpenSplitBillModal = (e, circle) => {
    e.stopPropagation();
    setSplitBillCircle(circle);
    setSplitBillContributors(circle.members);
    setIsSplitBillModalOpen(true);
  };

  const handleCloseSplitBillModal = () => {
    setIsSplitBillModalOpen(false);
    setSplitBillCircle(null);
    setSplitBillAmount("");
    setSplitBillContributors([]);
    setSplitBillError(null);
    setIsSplitting(false);
    setTimeout(() => setSplitBillAlert({ show: false, color: "info", message: "" }), 3000);
  };

  const renderCircleDetails = (circle) =>
    circle.members.map((member) => (
      <ListItem key={member.id} secondaryAction={
        member.id !== userId ? (
          <IconButton edge="end" aria-label="delete" onClick={(e) => handleRemoveMember(e, circle.id, member.id)}>
            <Icon color="error">delete</Icon>
          </IconButton>
        ) : null
      }>
        <ListItemText
          primary={<MDTypography variant="button" fontWeight="medium">{member.name}</MDTypography>}
        />
      </ListItem>
    ));

  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox py={3}>
        <MDBox mb={3}>
          {splitBillAlert.show && (
            <MDBox mb={2}>
              <MDAlert color={splitBillAlert.color} dismissible>{splitBillAlert.message}</MDAlert>
            </MDBox>
          )}
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12}>
              <MDBox display="flex" justifyContent="space-between" alignItems="center">
                <MDTypography variant="h4"></MDTypography>
                <MDButton variant="gradient" color="info" onClick={handleOpenCreateCircleModal}>
                  <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                  &nbsp;Create New Circle
                </MDButton>
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>

        {loading && (
          <MDBox display="flex" justifyContent="center" alignItems="center" p={2}>
            <CircularProgress color="info" />
            <MDTypography variant="button" color="text" ml={2}>
              Loading Circles...
            </MDTypography>
          </MDBox>
        )}

        {error && (
          <MDAlert color="error" dismissible>
            <MDTypography variant="body2" color="white">
              {error}
            </MDTypography>
          </MDAlert>
        )}

        <Grid container spacing={3}>
          {!loading && !error && circles.map((circle) => (
            <Grid item xs={12} md={6} lg={4} key={circle.id}>
              <Card sx={{ cursor: "pointer" }} onClick={() => handleToggleCircle(circle.id)}>
                <MDBox p={2}>
                  <MDBox display="flex" justifyContent="space-between" alignItems="flex-start">
                    <MDBox>
                      <MDTypography variant="h6" gutterBottom>
                        {circle.name}
                      </MDTypography>
                      <MDTypography variant="caption" color="text" fontWeight="medium">
                        Group ID: {circle.id}
                      </MDTypography>
                    </MDBox>
                    <Icon>{expandedCircle === circle.id ? "expand_less" : "expand_more"}</Icon>
                  </MDBox>
                  <Collapse in={expandedCircle === circle.id} timeout="auto" unmountOnExit>
                    <List dense>
                      {renderCircleDetails(circle)}
                    </List>
                    <MDBox display="flex" justifyContent="flex-end" mt={1} gap={1}>
                      <MDButton variant="outlined" color="secondary" size="small" onClick={(e) => { e.stopPropagation(); handleOpenAddMemberModal(circle.id); }}>
                        <Icon>person_add</Icon>&nbsp;Add Member
                      </MDButton>
                      <MDButton variant="outlined" color="info" size="small" onClick={(e) => handleOpenSplitBillModal(e, circle)}>
                        <Icon>call_split</Icon>&nbsp;Split Bill
                      </MDButton>
                    </MDBox>
                  </Collapse>
                </MDBox>
              </Card>
            </Grid>
          ))}
        </Grid>
      </MDBox>
      <Dialog open={isCreateModalOpen} onClose={handleCloseCreateCircleModal} fullWidth maxWidth="sm">
        <MDBox component="form" role="form" onSubmit={handleCreateCircle}>
          <DialogTitle>Create a New Paying Circle</DialogTitle>
          <DialogContent>
            <MDBox my={2}>
              <MDInput
                autoFocus
                label="Circle Name"
                type="text"
                fullWidth
                variant="standard"
                value={newCircleName}
                onChange={(e) => setNewCircleName(e.target.value)}
                error={!!createError}
                required
              />
            </MDBox>
            {createError && (
              <MDAlert color="error">
                <MDTypography variant="caption" color="white">
                  {createError}
                </MDTypography>
              </MDAlert>
            )}
          </DialogContent>
          <DialogActions>
            <MDButton onClick={handleCloseCreateCircleModal} color="secondary">
              Cancel
            </MDButton>
            <MDButton type="submit" variant="gradient" color="info" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create"}
            </MDButton>
          </DialogActions>
        </MDBox>
      </Dialog>

      {/* Add Member Modal */}
      <Dialog open={isAddMemberModalOpen} onClose={handleCloseAddMemberModal} fullWidth maxWidth="sm">
        <MDBox component="form" role="form" onSubmit={handleAddMember}>
          <DialogTitle>Add a New Member</DialogTitle>
          <DialogContent>
            <MDBox my={2}>
              <MDInput
                autoFocus
                label="User Account Number"
                type="text"
                fullWidth
                variant="standard"
                value={newMemberAccountNumber}
                onChange={(e) => setNewMemberAccountNumber(e.target.value)}
                error={!!addMemberError}
                required
              />
            </MDBox>
            {addMemberError && (
              <MDAlert color="error">
                <MDTypography variant="caption" color="white">{addMemberError}</MDTypography>
              </MDAlert>
            )}
          </DialogContent>
          <DialogActions>
            <MDButton onClick={handleCloseAddMemberModal} color="secondary">Cancel</MDButton>
            <MDButton type="submit" variant="gradient" color="info" disabled={isAddingMember}>
              {isAddingMember ? "Adding..." : "Add Member"}
            </MDButton>
          </DialogActions>
        </MDBox>
      </Dialog>

      {/* Split Bill Modal */}
      <Dialog open={isSplitBillModalOpen} onClose={handleCloseSplitBillModal} fullWidth maxWidth="sm">
        <MDBox component="form" role="form" onSubmit={handleSplitBill}>
          <DialogTitle>Split Bill for &quot;{splitBillCircle?.name}&quot;</DialogTitle>
          <DialogContent>
            <MDBox my={2}>
              <MDInput
                autoFocus
                label="Total Amount to Split"
                type="number"
                fullWidth
                variant="standard"
                value={splitBillAmount}
                onChange={(e) => setSplitBillAmount(e.target.value)}
                required
              />
            </MDBox>

            <MDTypography variant="h6" fontSize="small" mt={3}>Contributors ({splitBillContributors.length})</MDTypography>
            <MDTypography variant="body2" color="text">
              Amount per person: ₦{splitBillAmount && splitBillContributors.length > 0 ? (parseFloat(splitBillAmount) / splitBillContributors.length).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
            </MDTypography>

            <List dense>
              {splitBillContributors.map((member) => (
                <ListItem key={member.id} secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => setSplitBillContributors(prev => prev.filter(c => c.id !== member.id))}>
                    <Icon color="error">delete</Icon>
                  </IconButton>
                }>
                  <ListItemText
                    primary={<MDTypography variant="button" fontWeight="medium">{member.name}</MDTypography>}
                  />
                </ListItem>
              ))}
            </List>

            {splitBillError && (
              <MDBox mt={2}>
                <MDAlert color="error">
                  <MDTypography variant="caption" color="white">{splitBillError}</MDTypography>
                </MDAlert>
              </MDBox>
            )}

          </DialogContent>
          <DialogActions>
            <MDButton onClick={handleCloseSplitBillModal} color="secondary">
              Cancel
            </MDButton>
            <MDButton type="submit" variant="gradient" color="info" disabled={isSplitting}>
              {isSplitting ? "Splitting..." : "Split Bill"}
            </MDButton>
          </DialogActions>
        </MDBox>
      </Dialog>
    </DashboardLayout>
  );
}
