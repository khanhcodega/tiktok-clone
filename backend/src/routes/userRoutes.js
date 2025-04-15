const express = require("express");
const {
  getUserById /* other controllers */
} = require("../controllers/userController");
const router = express.Router();

// ... other user routes
router.get("/:id", getUserById); // Route to get user by ID

module.exports = router;
