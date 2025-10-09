

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import User from "layouts/user";
import Payments from "layouts/payments";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import Transfer from "layouts/transactions";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

// @mui icons
import Icon from "@mui/material/Icon";
import Transaction from "layouts/payments/components/Transaction";

const routes = [

  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "User",
    key: "User",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/User",
    component: <User />,
  },
  {
    type: "collapse",
    name: "Payments",
    key: "Payments",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/Payments",
    component: <Payments />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "divider",
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Transactions",
    key: "transactions",
    icon: <Icon fontSize="small">send</Icon>,
    route: "/transactions",
    component: <Transfer />,
  },
  {
    // This route is not displayed in the Sidenav but is necessary for the router to match dynamic views.
    type: "hidden",
    key: "transactions-view",
    route: "/transactions/:view",
    component: <Transfer />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
];

export default routes;
