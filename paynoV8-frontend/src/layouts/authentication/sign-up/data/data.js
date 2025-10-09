/**
 * Sign-up Business Logic and Data Handling
 */

// API endpoint

const baseUrl = "https://paynov8-hackathon-1.onrender.com";

const SIGNUP_ENDPOINT = `${baseUrl}/api/v1/user/create`;

/**
 * Client-side form validation
 */
const validateSignUpForm = (formData) => {
  const errors = {};

  if (!formData.firstName?.trim()) {
    return {
      isValid: false,
      errors: { general: 'First name is required' }
    };
  }

  if (!formData.lastName?.trim()) {
    return {
      isValid: false,
      errors: { general: 'Last name is required' }
    };
  }

  if (!formData.phoneNumber?.trim()) {
    return {
      isValid: false,
      errors: { general: 'Phone number is required' }
    };
  } else if (!isValidPhoneNumber(formData.phoneNumber)) {
    return {
      isValid: false,
      errors: { general: 'Please enter a valid phone number' }
    };
  }

  if (!formData.gender) {
    return {
      isValid: false,
      errors: { general: 'Gender is required' }
    };
  }

  if (!formData.address?.trim()) {
    return {
      isValid: false,
      errors: { general: 'Address is required' }
    };
  }

  if (!formData.email?.trim()) {
    return {
      isValid: false,
      errors: { general: 'Email is required' }
    };
  } else if (!isValidEmail(formData.email)) {
    return {
      isValid: false,
      errors: { general: 'Please enter a valid email' }
    };
  }

  if (!formData.password) {
    return {
      isValid: false,
      errors: { general: 'Password is required' }
    };
  } else if (formData.password.length < 6) {
    return {
      isValid: false,
      errors: { general: 'Password must be at least 6 characters' }
    };
  }

  if (!formData.agreedToTerms) {
    return {
      isValid: false,
      errors: { general: 'You must agree to the Terms and Conditions' }
    };
  }

  return {
    isValid: true,
    errors: {}
  };
};

/**
 * Main sign-up submission
 */
const submitSignUp = async (formData) => {
  try {
    const signUpData = {
      firstName: formData.firstName.trim(),
      middleName: formData.middleName?.trim() || '', // Optional field
      lastName: formData.lastName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      gender: formData.gender,
      address: formData.address.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password
    };

    const response = await fetch(SIGNUP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signUpData),
    });

    const result = await response.json();

    if (response.ok) {
      return {
        success: true,
        data: result,
        message: 'Registration successful!'
      };
    } else {
      return {
        success: false,
        error: getErrorMessage(result),
        statusCode: response.status
      };
    }

  } catch (error) {
    return {
      success: false,
      error: 'Network error. Please check your connection.'
    };
  }
};

/**
 * Complete sign-up process
 */
const processSignUp = async (formData) => {
  // Step 1: Validate
  const validation = validateSignUpForm(formData);
  if (!validation.isValid) {
    return {
      success: false,
      error: validation.errors.general,
      fieldErrors: validation.errors
    };
  }

  // Step 2: Submit to server
  const result = await submitSignUp(formData);
  return result;
};

/**
 * Get initial empty form state
 */
const getInitialFormData = () => ({
  firstName: '',
  middleName: '',
  lastName: '',
  phoneNumber: '',
  gender: '',
  address: '',
  email: '',
  password: '',
  agreedToTerms: false
});

// Helper functions
const getErrorMessage = (serverResponse) => {
  if (serverResponse.message) return serverResponse.message;
  if (serverResponse.error) return serverResponse.error;
  if (serverResponse.code === 'USER_EXISTS') return 'Email already registered';
  return 'Registration failed. Please try again.';
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

// Named exports
export {
  validateSignUpForm,
  submitSignUp,
  processSignUp,
  getInitialFormData
};