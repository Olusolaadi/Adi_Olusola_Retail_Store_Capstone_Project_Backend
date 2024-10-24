import { check, validationResult } from "express-validator";

export const validateUser = [
  check("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Name cannot be found.")
    .isLength({ min: 3, max: 30 })
    .withMessage("Name must be 3 to 30 characters long."),
  check("username")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Username cannot be found.")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be 3 to 30 characters long."),
  check("email").normalizeEmail().isEmail().withMessage("Invalid Email."),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("No password.")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be 6 to 20 characters long."),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req).array();
  if (!errors.length) return next();
  return res.status(400).json({ success: false, error: errors[0].msg });
};