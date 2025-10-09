/**
 * Consumes the signup API to create a new user.
 * @param {object} userData - The user data to be sent to the backend.
 * @param {string} userData.firstName - The user's first name.
 * @param {string} userData.middleName - The user's middle name.
 * @param {string} userData.lastName - The user's last name.
 * @param {string} userData.phoneNumber - The user's phone number.
 * @param {string} userData.gender - The user's gender ('M' or 'F').
 * @param {string} userData.address - The user's address.
 * @param {string} userData.email - The user's email address.
 * @param {string} userData.password - The user's password.
 * @returns {Promise<object>} A promise that resolves to the server's response data.
 */
async function createUser(userData) {
    const url = "http://localhost:8080/api/v1/user/create";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            // If the server response is not OK, throw an error with the status
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(`API Error: ${response.status} - ${errorData.message || "Unknown error"}`);
        }

        // If the response is OK, parse and return the JSON data
        return await response.json();
    } catch (error) {
        console.error("Failed to create user:", error);
        throw error; // Re-throw the error so the calling component can handle it
    }
}

export default createUser;
