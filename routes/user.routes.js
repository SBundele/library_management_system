const express = require("express");
const {User} = require("../models/user.model"); // Import your User model
const {adminAuth} = require("../middlewares/auth.middleware"); // Import admin middleware

const userRouter = express.Router();

// GET: Retrieve all users (Admin only)
userRouter.get("/users", adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude sensitive data like password
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = {userRouter};
