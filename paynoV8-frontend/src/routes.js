
// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import User from "layouts/user";
import Payments from "layouts/payments";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
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
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Send Money",
    key: "send-money",
    icon: <Icon fontSize="small">send</Icon>,
    route: "/send-money",
    component: <User />,
  },
  {
    type: "collapse",
    name: "Split Bills",
    key: "split-bills",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/bills-payment",
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
    name: "User Verification",
    key: "user-verification",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/user-verification",
    component: <Profile />,
  },
  {
    // This route is now hidden from the sidebar but still accessible.
    // You can route unauthenticated users to this page.
    type: "hidden", // A custom type to signify it's not for the sidebar
    name: "Sign In",
    key: "sign-in",
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    // This route is now hidden from the sidebar but still accessible.
    // You can route unauthenticated users to this page.
    type: "hidden",
    name: "Sign Up",
    key: "sign-up",
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
];

export default routes;
