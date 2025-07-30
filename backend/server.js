require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const employeeRoutes = require("./routes/employees");
const authRoutes = require("./routes/auth");
const auth = require("./middleware/auth");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", auth, employeeRoutes);

app.get("/", (req, res) => {
  res.send("✅ Employee Management API is running.");
});

// Error handling middleware (must be last)
app.use(errorHandler);

// ✅ Only connect DB if NOT in test mode
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
}

// ✅ Only start server if not testing
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app; // ✅ Export the app for Supertest
