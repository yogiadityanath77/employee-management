// middleware/validateEmployee.js
const { body, validationResult } = require("express-validator");
const { ValidationError } = require("./errorHandler");

exports.validateEmployee = [
  body("name").notEmpty().withMessage("Name is required."),
  body("mobile")
    .notEmpty()
    .withMessage("Mobile is required.")
    .matches(/^\d{10}$/)
    .withMessage("Mobile must be 10 digits."),
  body("email").isEmail().withMessage("Valid email is required."),
  body("position").notEmpty().withMessage("Position is required."),
  body("salary")
    .isNumeric()
    .withMessage("Salary must be a number.")
    .custom((value) => value >= 0)
    .withMessage("Salary must be positive."),

  // Final error handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      }));
      throw new ValidationError("Validation failed", formattedErrors);
    }
    next();
  },
];
