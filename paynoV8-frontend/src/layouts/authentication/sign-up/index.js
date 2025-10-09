/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Data layer
import { processSignUp, getInitialFormData } from "./data/data";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

function Cover() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(getInitialFormData());
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Handle input changes
  const handleInputChange = (field) => (event) => {
    const value = field === "agreedToTerms" ? event.target.checked : event.target.value;
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (submitError) {
      setSubmitError("");
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setSubmitError("");

    try {
      const result = await processSignUp(formData);

      if (result.success) {
        // Success - redirect to sign-in page
        console.log("Sign-up successful:", result.data);
        
        // Show success message and redirect
        alert("Registration successful! Redirecting to sign in...");
        
        // Redirect to sign-in page after a brief delay
        setTimeout(() => {
          navigate("/authentication/sign-in");
        }, 1500);
        
      } else {
        // Handle errors - only show general error
        setSubmitError(result.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Sign-up error:", error);
      setSubmitError("An unexpected error occurred. Please try again.");
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
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Join PAYNOV8
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your details to register
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            {/* First Name */}
            <MDBox mb={2}>
              <MDInput 
                type="text" 
                label="First Name" 
                variant="standard" 
                fullWidth 
                value={formData.firstName}
                onChange={handleInputChange("firstName")}
                required
              />
            </MDBox>

            {/* Middle Name  */}
            <MDBox mb={2}>
              <MDInput 
                type="text" 
                label="Middle Name" 
                variant="standard" 
                fullWidth 
                value={formData.middleName}
                required
                onChange={handleInputChange("middleName")}
              />
            </MDBox>

            {/* Last Name */}
            <MDBox mb={2}>
              <MDInput 
                type="text" 
                label="Last Name" 
                variant="standard" 
                fullWidth 
                value={formData.lastName}
                onChange={handleInputChange("lastName")}
                required
              />
            </MDBox>

            {/* Phone Number */}
            <MDBox mb={2}>
              <MDInput 
                type="tel" 
                label="Phone Number" 
                variant="standard" 
                fullWidth 
                value={formData.phoneNumber}
                onChange={handleInputChange("phoneNumber")}
                required
              />
            </MDBox>

            {/* Gender */}
            <MDBox mb={2}>
              <FormControl fullWidth variant="standard">
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.gender}
                  onChange={handleInputChange("gender")}
                  label="Gender"
                  required
                >
                  <MenuItem value=""><em>Select Gender</em></MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </MDBox>

            {/* Address */}
            <MDBox mb={2}>
              <MDInput 
                type="text" 
                label="Address" 
                variant="standard" 
                fullWidth 
                value={formData.address}
                onChange={handleInputChange("address")}
                required
              />
            </MDBox>

            {/* Email */}
            <MDBox mb={2}>
              <MDInput 
                type="email" 
                label="Email" 
                variant="standard" 
                fullWidth 
                value={formData.email}
                onChange={handleInputChange("email")}
                required
              />
            </MDBox>

            {/* Password */}
            <MDBox mb={2}>
              <MDInput 
                type="password" 
                label="Password" 
                variant="standard" 
                fullWidth 
                value={formData.password}
                onChange={handleInputChange("password")}
                required
              />
            </MDBox>

            {/* Terms Checkbox */}
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox 
                checked={formData.agreedToTerms}
                onChange={handleInputChange("agreedToTerms")}
              />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;I agree the&nbsp;
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                Terms and Conditions
              </MDTypography>
            </MDBox>

            {/* Single Error Message Display */}
            {submitError && (
              <MDBox mt={2} mb={2} textAlign="center">
                <MDTypography variant="caption" color="error" fontSize="small">
                  {submitError}
                </MDTypography>
              </MDBox>
            )}

            {/* Submit Button */}
            <MDBox mt={4} mb={1}>
              <MDButton 
                variant="gradient" 
                color="info" 
                fullWidth 
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </MDButton>
            </MDBox>

            {/* Sign In Link */}
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Cover;