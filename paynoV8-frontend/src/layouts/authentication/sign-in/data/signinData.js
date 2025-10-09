/**
 * Consumes the login API to authenticate a user.
 * @param {object} credentials - The user's login credentials.
 * @param {string} credentials.email - The user's email.
 * @param {string} credentials.password - The user's password.
 * @returns {Promise<string>} A promise that resolves to the authentication token.
 */
async function LoginData(credentials) {

  const baseUrl = "https://paynov8-hackathon-1.onrender.com";
  const url = `${baseUrl}/api/v1/user/login`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(credentials),
    });

    // Handle non-successful responses (e.g., 401, 404, 500)
    if (!response.ok) {
      let errorMessage = `Login failed with status: ${response.status}`;
      try {
        const errorData = await response.json();
        // Use a more specific error message from the backend if available
        errorMessage = errorData.message || JSON.stringify(errorData);
      } catch (e) {
        // If the error response is not JSON, use the status text
        errorMessage = response.statusText;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Validate the successful response structure and extract the token
    if (data.statusCode === 201 && data.message) {
      return data.message; // Assuming the 'message' field contains the auth token
    } else {
      throw new Error("Invalid response format from server.");
    }
  } catch (error) {
    console.error("Login request failed:", error.message);
    throw error; // Re-throw for the component to handle
  }
}

export default LoginData;
