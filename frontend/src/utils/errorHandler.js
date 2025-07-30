// utils/errorHandler.js

// Parse error response from backend
export const parseError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { data, status } = error.response;

    // Check if it's our new error format
    if (data && data.error) {
      return {
        message: data.error.message,
        code: data.error.code,
        details: data.error.details || [],
        status,
      };
    }

    // Fallback for old error format
    if (data && data.message) {
      return {
        message: data.message,
        status,
      };
    }

    // Generic HTTP error
    return {
      message: `Server error (${status})`,
      status,
    };
  }

  if (error.request) {
    // Network error
    return {
      message: "Network error. Please check your connection.",
      code: "NETWORK_ERROR",
    };
  }

  // Other errors
  return {
    message: error.message || "An unexpected error occurred",
    code: "UNKNOWN_ERROR",
  };
};

// Display error message to user
export const showError = (error, setError = null, setErrorDetails = null) => {
  const parsedError = parseError(error);

  console.error("🚨 Frontend Error:", parsedError);

  if (setError) {
    setError(parsedError.message);
  }

  if (setErrorDetails && parsedError.details) {
    setErrorDetails(parsedError.details);
  }

  if (!setError) {
    // Fallback to alert if no setError function provided
    let alertMessage = parsedError.message;
    if (parsedError.details && parsedError.details.length > 0) {
      alertMessage +=
        "\n\nDetails:\n" +
        parsedError.details.map((d) => `${d.field}: ${d.message}`).join("\n");
    }
    alert(alertMessage);
  }

  return parsedError;
};

// Display success message
export const showSuccess = (message, setSuccess = null) => {
  console.log("✅ Success:", message);

  if (setSuccess) {
    setSuccess(message);
  } else {
    alert(message);
  }
};

// Clear error/success messages after delay
export const clearMessages = (
  setError = null,
  setSuccess = null,
  delay = 5000
) => {
  setTimeout(() => {
    if (setError) setError(null);
    if (setSuccess) setSuccess(null);
  }, delay);
};

// Format validation errors for display
export const formatValidationErrors = (details) => {
  if (!details || !Array.isArray(details)) return null;

  return details
    .map((detail) => `${detail.field}: ${detail.message}`)
    .join("\n");
};
