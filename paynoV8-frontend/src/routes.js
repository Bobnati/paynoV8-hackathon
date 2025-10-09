

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Savings from "layouts/savings";
import Payments from "layouts/payments";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import Transfer from "layouts/transactions";
import SignIn from "layouts/authentication/sign-in";
import ProtectedRoute from "layouts/authentication/ProtectedRoute";
import SignUp from "layouts/authentication/sign-up";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [

  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    type: "collapse",
    name: "Savings",
    key: "Savings",
    icon: <Icon fontSize="small">savings</Icon>,
    route: "/savings",
    component: (
      <ProtectedRoute>
        <Savings />
      </ProtectedRoute>
    ),
  },
  {
    type: "collapse",
    name: "Payments",
    key: "Payments",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/Payments",
    component: (
      <ProtectedRoute>
        <Payments />
      </ProtectedRoute>
    ),
  },
  {
    type: "collapse",
    name: "Transfer",
    key: "transactions",
    icon: <Icon fontSize="small">send</Icon>,
    route: "/transactions",
    component: (
      <ProtectedRoute>
        <Transfer />
      </ProtectedRoute>
    ),
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: (
      <ProtectedRoute>
        <Notifications />
      </ProtectedRoute>
    ),
  },
  {
    type: "divider",
  },
  {
    type: "hidden",
    name: "Transaction History",
    key: "transactions",
    icon: <Icon fontSize="small">send</Icon>,
    route: "/transactions",
    component: (
      <ProtectedRoute>
        <Transfer />
      </ProtectedRoute>
    ),
  },
  {
    // This route is not displayed in the Sidenav but is necessary for the router to match dynamic views.
    type: "hidden",
    key: "transactions-view",
    route: "/transactions/:view",
    component: (
      <ProtectedRoute>
        <Transfer />
      </ProtectedRoute>
    ),
  },
  {
    type: "collapse",
    name: "Log Out",
    key: "Sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/Sign-in",
    component: <SignIn />,
  },
];

export default routes;
