import { useState } from "react";

import { useNavigate } from "react-router-dom";

import LoginData from "./data/signinData.js";
// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

function SignIn() {
  const [rememberMe, setRememberMe] = useState(false);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out after 3 seconds")), 3000)
      );
      const authToken = await Promise.race([
        LoginData(formData),
        timeoutPromise
      ]);
      console.log("Login successful, token received.");
      // Set expiration time to 1 hour from now
      const expiryTime = new Date().getTime() + 60 * 60 * 1000;
      const authData = {
        token: authToken,
        expiry: expiryTime,
      };
      // Extract username from email to use as a key for user-specific data
      const userName = formData.email.split("@")[0];
      localStorage.setItem("loggedInUser", userName);

      // Save the auth data object to localStorage
      localStorage.setItem("authData", JSON.stringify(authData));
      // Redirect to the dashboard on successful login
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      console.error("Login failed, proceeding with mock auth for demo:", err);

      // Fallback for demo: Use email to create user data and navigate anyway
      const expiryTime = new Date().getTime() + 60 * 60 * 1000;
      const authData = {
        token: "mock-token-for-demo", // Use a mock token as API failed
        expiry: expiryTime,
      };
      const userName = formData.email.split("@")[0];
      localStorage.setItem("loggedInUser", userName);
      localStorage.setItem("authData", JSON.stringify(authData));
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign In
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSignIn}>
            <MDBox mb={2}>
              <MDInput
                type="email"
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                name="password"
                label="Password"
                value={formData.password}
                onChange={handleInputChange}
                fullWidth
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            {error && (
              <MDTypography variant="caption" color="error" fontWeight="light">
                {error}
              </MDTypography>
            )}
            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="info" fullWidth disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default SignIn;
