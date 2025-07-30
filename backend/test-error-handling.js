// test-error-handling.js
// Simple test to verify error handling

const axios = require("axios");

const BASE_URL = "http://localhost:5000";

async function testErrorHandling() {
  console.log("🧪 Testing Error Handling...\n");

  // Test 1: Invalid login credentials
  console.log("1. Testing invalid login credentials...");
  try {
    await axios.post(`${BASE_URL}/api/auth/login`, {
      email: "invalid@email.com",
      password: "wrongpassword",
    });
  } catch (error) {
    console.log("✅ Expected error caught:");
    console.log("   Status:", error.response?.status);
    console.log("   Message:", error.response?.data?.error?.message);
    console.log("   Code:", error.response?.data?.error?.code);
  }

  // Test 2: Missing required fields in registration
  console.log("\n2. Testing missing fields in registration...");
  try {
    await axios.post(`${BASE_URL}/api/auth/register`, {
      username: "testuser",
      // missing email and password
    });
  } catch (error) {
    console.log("✅ Expected error caught:");
    console.log("   Status:", error.response?.status);
    console.log("   Message:", error.response?.data?.error?.message);
    console.log("   Code:", error.response?.data?.error?.code);
  }

  // Test 3: Invalid email format
  console.log("\n3. Testing invalid email format...");
  try {
    await axios.post(`${BASE_URL}/api/auth/register`, {
      username: "testuser",
      email: "invalid-email",
      password: "password123",
    });
  } catch (error) {
    console.log("✅ Expected error caught:");
    console.log("   Status:", error.response?.status);
    console.log("   Message:", error.response?.data?.error?.message);
    console.log("   Code:", error.response?.data?.error?.code);
  }

  // Test 4: Weak password
  console.log("\n4. Testing weak password...");
  try {
    await axios.post(`${BASE_URL}/api/auth/register`, {
      username: "testuser",
      email: "test@example.com",
      password: "123", // too short
    });
  } catch (error) {
    console.log("✅ Expected error caught:");
    console.log("   Status:", error.response?.status);
    console.log("   Message:", error.response?.data?.error?.message);
    console.log("   Code:", error.response?.data?.error?.code);
  }

  // Test 5: Invalid employee data
  console.log("\n5. Testing invalid employee data...");
  try {
    await axios.post(`${BASE_URL}/api/employees`, {
      name: "John Doe",
      mobile: "123", // invalid mobile format
      email: "invalid-email",
      position: "Developer",
      salary: -1000, // negative salary
    });
  } catch (error) {
    console.log("✅ Expected error caught:");
    console.log("   Status:", error.response?.status);
    console.log("   Message:", error.response?.data?.error?.message);
    console.log("   Code:", error.response?.data?.error?.code);
    if (error.response?.data?.error?.details) {
      console.log("   Details:", error.response.data.error.details);
    }
  }

  // Test 6: Invalid ID format
  console.log("\n6. Testing invalid ID format...");
  try {
    await axios.put(`${BASE_URL}/api/employees/invalid-id`, {
      name: "John Doe",
      mobile: "1234567890",
      email: "john@example.com",
      position: "Developer",
      salary: 50000,
    });
  } catch (error) {
    console.log("✅ Expected error caught:");
    console.log("   Status:", error.response?.status);
    console.log("   Message:", error.response?.data?.error?.message);
    console.log("   Code:", error.response?.data?.error?.code);
  }

  console.log("\n🎉 Error handling tests completed!");
}

// Run the test if this file is executed directly
if (require.main === module) {
  testErrorHandling().catch(console.error);
}

module.exports = testErrorHandling;
