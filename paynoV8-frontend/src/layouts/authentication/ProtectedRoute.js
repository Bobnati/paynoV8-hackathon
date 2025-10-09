import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * A component that checks for a valid authentication token and redirects to the sign-in page if the token is missing or expired.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render if the user is authenticated.
 * @returns {React.ReactElement} The child components or a redirect to the sign-in page.
 */
function ProtectedRoute({ children }) {
    const location = useLocation();
    const authDataString = localStorage.getItem("authData");

    if (!authDataString) {

        // User is not logged in, redirect to sign-in page
        return <Navigate to="/authentication/sign-in" state={{ from: location }} replace />;
    }

    const authData = JSON.parse(authDataString);
    const now = new Date().getTime();

    if (now > authData.expiry) {
        // Token has expired, remove it and redirect to sign-in
        localStorage.removeItem("authData");
        return <Navigate to="/authentication/sign-in" state={{ from: location }} replace />;
    }

    // User is authenticated and token is valid, render the requested component
    return children;
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
