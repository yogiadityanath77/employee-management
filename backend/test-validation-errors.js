// test-validation-errors.js
// Test script to demonstrate detailed validation error messages

const axios = require("axios");

const BASE_URL = "http://localhost:5000";

async function testValidationErrors() {
  console.log("🧪 Testing Detailed Validation Error Messages...\n");

  // Test 1: Multiple validation errors in employee form
  console.log("1. Testing employee form with multiple validation errors...");
  try {
    await axios.post(`${BASE_URL}/api/employees`, {
      name: "", // empty name
      mobile: "123", // invalid mobile (not 10 digits)
      email: "invalid-email", // invalid email format
      position: "", // empty position
      salary: -1000, // negative salary
    });
  } catch (error) {
    console.log("✅ Validation Error Response:");
    console.log("   Status:", error.response?.status);
    console.log("   Main Message:", error.response?.data?.error?.message);
    console.log("   Error Code:", error.response?.data?.error?.code);
    console.log("   Field Details:");
    if (error.response?.data?.error?.details) {
      error.response.data.error.details.forEach((detail) => {
        console.log(`     • ${detail.field}: ${detail.message}`);
      });
    }
  }

  // Test 2: Registration with validation errors
  console.log("\n2. Testing registration with validation errors...");
  try {
    await axios.post(`${BASE_URL}/api/auth/register`, {
      username: "", // empty username
      email: "invalid-email", // invalid email
      password: "123", // too short password
    });
  } catch (error) {
    console.log("✅ Registration Error Response:");
    console.log("   Status:", error.response?.status);
    console.log("   Main Message:", error.response?.data?.error?.message);
    console.log("   Error Code:", error.response?.data?.error?.code);
    console.log("   Field Details:");
    if (error.response?.data?.error?.details) {
      error.response.data.error.details.forEach((detail) => {
        console.log(`     • ${detail.field}: ${detail.message}`);
      });
    }
  }

  // Test 3: Login with validation errors
  console.log("\n3. Testing login with validation errors...");
  try {
    await axios.post(`${BASE_URL}/api/auth/login`, {
      email: "", // empty email
      password: "", // empty password
    });
  } catch (error) {
    console.log("✅ Login Error Response:");
    console.log("   Status:", error.response?.status);
    console.log("   Main Message:", error.response?.data?.error?.message);
    console.log("   Error Code:", error.response?.data?.error?.code);
    console.log("   Field Details:");
    if (error.response?.data?.error?.details) {
      error.response.data.error.details.forEach((detail) => {
        console.log(`     • ${detail.field}: ${detail.message}`);
      });
    }
  }

  console.log("\n🎉 Validation error tests completed!");
  console.log("\n📝 What users will see in the frontend:");
  console.log('   • Main error message (e.g., "Validation failed")');
  console.log("   • List of specific field errors:");
  console.log("     - name: Name is required.");
  console.log("     - mobile: Mobile must be 10 digits.");
  console.log("     - email: Valid email is required.");
  console.log("     - etc.");
}

// Run the test if this file is executed directly
if (require.main === module) {
  testValidationErrors().catch(console.error);
}

module.exports = testValidationErrors;
