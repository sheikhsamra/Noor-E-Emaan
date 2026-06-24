import { body, validationResult } from "express-validator";

// Run after validation rules — collects errors and returns them
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// --- Auth ---
export const signupRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  body("phone").optional({ checkFalsy: true }).isMobilePhone().withMessage("Invalid phone number"),
];

export const loginRules = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// --- Products ---
export const productCreateRules = [
  body("name").trim().notEmpty().withMessage("Product name is required"),
  body("price").isFloat({ min: 1 }).withMessage("Price must be greater than 0"),
  body("discountPrice")
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage("Discount price must be a positive number"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative whole number"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
];

export const productUpdateRules = [
  body("name").optional().trim().notEmpty().withMessage("Product name cannot be empty"),
  body("price").optional().isFloat({ min: 1 }).withMessage("Price must be greater than 0"),
  body("discountPrice")
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage("Discount price must be a positive number"),
  body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be a non-negative whole number"),
  body("category").optional().trim().notEmpty().withMessage("Category cannot be empty"),
];

// --- Orders ---
export const orderRules = [
  body("items").isArray({ min: 1 }).withMessage("Order must contain at least one item"),
  body("items.*.productId").notEmpty().withMessage("Each item must have a valid product ID"),
  body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  body("customerInfo.name").trim().notEmpty().withMessage("Customer name is required"),
  body("customerInfo.email").isEmail().normalizeEmail().withMessage("Valid customer email is required"),
  body("customerInfo.phone").trim().notEmpty().withMessage("Phone number is required"),
  body("customerInfo.address").trim().notEmpty().withMessage("Delivery address is required"),
];
