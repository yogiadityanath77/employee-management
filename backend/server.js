require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const employeeRoutes = require("./routes/employees");
const authRoutes = require("./routes/auth");
const auth = require("./middleware/auth");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

// ✅ CORS Setup — Allow frontend from Vercel + local dev
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://employee-management-kohl-tau.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", auth, employeeRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("✅ Employee Management API is running.");
});

// ✅ Error handling middleware (must be last)
app.use(errorHandler);

// ✅ Connect DB if not in test mode
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
}

// ✅ Start server if not being tested
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
