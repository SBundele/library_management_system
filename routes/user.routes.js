const express = require("express");
const {User} = require("../models/user.model"); // Import your User model
const {adminAuth, userAdminAuth} = require("../middlewares/auth.middleware"); // Import admin middleware

const userRouter = express.Router();

// GET: Retrieve all users (Admin only)
userRouter.get("/", adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude sensitive data like password
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

userRouter.get("/:id", userAdminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(["-password", "-createdAt", "-updatedAt"]); // Exclude password from the result
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
})

// PUT: Update user information (Admin or the user themselves)
userRouter.put("/:id", userAdminAuth, async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const updateFields = {};

      // Update name if provided
      if (username) updateFields.username = username;

      // Update email if provided
      if (email) updateFields.email = email;

      // Hash new password if provided
      if (password) {
        const salt = await bcrypt.genSalt(5);
        updateFields.password = await bcrypt.hash(password, salt);
      }

      // Update user details
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        updateFields,
        {
          new: true, // Return updated document
          runValidators: true, // Ensure validation rules are applied
        }
      ).select("-password"); // Exclude password in the response

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

userRouter.delete("/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = {userRouter};
