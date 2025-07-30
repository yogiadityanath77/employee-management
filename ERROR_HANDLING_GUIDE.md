# Error Handling Guide

This document outlines the comprehensive error handling system implemented in the Employee Management application.

## Overview

The application now provides detailed, user-friendly error messages both in the backend logs and on the frontend, replacing generic "Something went wrong" messages with specific, actionable error information.

## Backend Error Handling

### 1. Centralized Error Handler (`middleware/errorHandler.js`)

The application uses a centralized error handling middleware that:

- **Logs detailed error information** including URL, method, message, stack trace, request body, and user context
- **Categorizes errors** into specific types (Validation, Authentication, Authorization, etc.)
- **Provides consistent error responses** with standardized format
- **Handles common error scenarios** like Mongoose validation errors, JWT errors, and database errors

### 2. Custom Error Classes

```javascript
// Available error classes
AppError; // Base error class
ValidationError; // For input validation failures
AuthenticationError; // For auth-related issues
AuthorizationError; // For permission issues
NotFoundError; // For missing resources
DatabaseError; // For database operation failures
```

### 3. Error Response Format

All error responses follow this consistent format:

```json
{
  "success": false,
  "error": {
    "message": "Specific error message",
    "code": "ERROR_CODE",
    "details": [
      {
        "field": "fieldName",
        "message": "Field-specific error",
        "value": "invalid value"
      }
    ]
  }
}
```

### 4. Async Error Wrapper

The `asyncHandler` utility automatically catches async errors and passes them to the error handling middleware:

```javascript
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    // Your route logic here
    // Any thrown errors will be automatically caught
  })
);
```

## Frontend Error Handling

### 1. Error Parsing Utility (`utils/errorHandler.js`)

The frontend includes utilities to:

- **Parse backend error responses** and extract meaningful messages
- **Handle different error types** (network errors, validation errors, etc.)
- **Display user-friendly messages** instead of technical error details
- **Format validation errors** for better user experience

### 2. Reusable Components

#### ErrorMessage Component

Displays error messages with:

- Red styling with error icon
- Dismissible functionality
- Clear, readable text

#### SuccessMessage Component

Displays success messages with:

- Green styling with success icon
- Dismissible functionality
- Positive feedback

### 3. Loading States

All forms now include:

- **Loading indicators** during API calls
- **Disabled buttons** to prevent multiple submissions
- **Clear visual feedback** for user actions

## Specific Error Scenarios

### Authentication Errors

- **Invalid credentials**: "Invalid email or password"
- **Missing token**: "No authentication token provided"
- **Expired token**: "Authentication token has expired"
- **Invalid token**: "Invalid authentication token"

### Validation Errors

- **Missing fields**: "All fields are required"
- **Invalid email**: "Please provide a valid email address"
- **Weak password**: "Password must be at least 6 characters long"
- **Invalid mobile**: "Mobile must be 10 digits"
- **Negative salary**: "Salary must be positive"

### Database Errors

- **Duplicate email**: "User with this email already exists"
- **Invalid ID**: "Invalid ID format"
- **Resource not found**: "Employee not found"

### Network Errors

- **Connection issues**: "Network error. Please check your connection."
- **Server errors**: "Server error (500)"

## Backend Logging

The error handler provides comprehensive logging:

```
🚨 ERROR DETAILS:
📍 URL: /api/auth/login
🔧 Method: POST
📝 Message: Invalid email or password
📊 Status Code: 400
🔍 Stack: Error: Invalid email or password...
📦 Body: { email: 'test@example.com', password: 'wrong' }
👤 User: Not authenticated
⏰ Timestamp: 2024-01-15T10:30:00.000Z
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Testing Error Handling

Run the error handling test:

```bash
cd assessment/backend
node test-error-handling.js
```

This will test various error scenarios and verify that proper error messages are returned.

## Benefits

1. **Better User Experience**: Users see specific, actionable error messages
2. **Easier Debugging**: Detailed backend logging helps developers identify issues
3. **Consistent Error Format**: Standardized error responses across the application
4. **Improved Security**: Error messages don't expose sensitive information
5. **Better Validation**: Comprehensive input validation with field-specific errors

## Implementation Notes

- All routes now use the `asyncHandler` wrapper
- Error messages are user-friendly and specific
- Loading states prevent multiple form submissions
- Error messages auto-dismiss after 3-5 seconds
- Success messages provide positive feedback
- Backend logs include comprehensive debugging information

## Future Enhancements

- Add error tracking/monitoring (e.g., Sentry)
- Implement error reporting to administrators
- Add error analytics and trending
- Create error recovery suggestions for users
