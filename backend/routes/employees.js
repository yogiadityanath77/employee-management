const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const { validateEmployee } = require("../middleware/validateEmployee");
const {
  asyncHandler,
  NotFoundError,
  DatabaseError,
} = require("../middleware/errorHandler");

// ==============================
// CREATE
// ==============================
router.post(
  "/",
  validateEmployee,
  asyncHandler(async (req, res) => {
    const newEmployee = new Employee(req.body);
    await newEmployee.save();
    res.status(201).json({
      success: true,
      data: newEmployee,
      message: "Employee created successfully",
    });
  })
);

// ==============================
// READ with Filtering, Sorting, Pagination
// ==============================
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { search, sort, page = 1, limit = 5 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { position: { $regex: search, $options: "i" } },
      ];
    }

    // ✅ Verified sort config
    let sortOption = {};
    if (sort === "salary") {
      sortOption = { salary: -1 }; // High to low
    } else if (sort === "name") {
      sortOption = { name: 1 }; // A-Z
    } else if (sort) {
      sortOption = { [sort]: 1 };
    }

    const employees = await Employee.find(query)
      .collation({ locale: "en", strength: 2 }) // ✅ Case-insensitive sort
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Employee.countDocuments(query);

    res.json({
      success: true,
      data: employees,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  })
);

// ==============================
// UPDATE
// ==============================
router.put(
  "/:id",
  validateEmployee,
  asyncHandler(async (req, res) => {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedEmployee) {
      throw new NotFoundError("Employee");
    }

    res.json({
      success: true,
      data: updatedEmployee,
      message: "Employee updated successfully",
    });
  })
);

// ==============================
// DELETE
// ==============================
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);

    if (!deletedEmployee) {
      throw new NotFoundError("Employee");
    }

    res.json({
      success: true,
      message: "Employee deleted successfully",
    });
  })
);

module.exports = router;
