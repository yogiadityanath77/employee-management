// models/Employee.js

const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    position: {
      type: String,
      required: [true, "Position is required"],
    },
    salary: {
      type: Number,
      required: [true, "Salary is required"],
    },
  },
  { timestamps: true }
);

// ✅ Add indexes for fast search
employeeSchema.index({ name: 1 });
employeeSchema.index({ position: 1 });
// OR for text search:
// employeeSchema.index({ name: "text", position: "text", email: "text" });

module.exports = mongoose.model("Employee", employeeSchema);
