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

import { useState, useEffect } from "react";

// react-router components
import { useLocation, Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState("sticky");
  const [transparentNavbar, setTransparentNavbar] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    // Setting the navbar type based on scroll
    function handleScroll() {
      if (window.scrollY === 0) {
        setNavbarType("sticky");
        setTransparentNavbar(true);
      } else {
        setNavbarType("static");
        setTransparentNavbar(false);
      }
    }

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      // ...existing props...
    >
      {/* ...existing navbar content... */}
    </AppBar>
  );
}

DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
