const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { User } = require("../models/user.model");
const { adminAuth, userAdminAuth } = require("../middlewares/auth.middleware");

const userRouter = express.Router();

// Utility for error handling
const handleError = (res, error, message = "Server error") => {
  console.error(error);
  res.status(500).json({ error: message });
};

// Validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Build fields for PATCH
const buildUpdateFields = async (body, currentUserRole) => {
  const updateFields = {};

  if (body.username) updateFields.username = body.username;
  if (body.email) updateFields.email = body.email;

  if (body.role) {
    if (currentUserRole === "admin") {
      updateFields.role = body.role;
    } else {
      throw new Error("Only admins can update roles");
    }
  }

  if (body.password) {
    const salt = await bcrypt.genSalt(5);
    updateFields.password = await bcrypt.hash(body.password, salt);
  }

  return updateFields;
};

// GET: All users (with pagination)
userRouter.get("/", adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const users = await User.find()
      .select("-password")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const totalUsers = await User.countDocuments();

    res.status(200).json({
      users,
      meta: {
        total: totalUsers,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error) {
    handleError(res, error);
  }
});

// GET: Single user
userRouter.get("/:id", userAdminAuth, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(req.params.id)
      .select(["-password", "-createdAt", "-updatedAt"])
      .lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    handleError(res, error);
  }
});

// PATCH: Update user
userRouter.patch("/:id", userAdminAuth, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const updateFields = await buildUpdateFields(req.body, req.user.role);

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error.message === "Only admins can update roles") {
      return res.status(403).json({ error: error.message });
    }
    handleError(res, error);
  }
});

// DELETE: Remove user
userRouter.delete("/:id", adminAuth, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id).select(
      "-password"
    );

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = { userRouter };

// const express = require("express");
// const {User} = require("../models/user.model"); // Import your User model
// const {adminAuth, userAdminAuth} = require("../middlewares/auth.middleware"); // Import admin middleware

// const userRouter = express.Router();

// // GET: Retrieve all users (Admin only)
// userRouter.get("/", adminAuth, async (req, res) => {
//   try {
//     const users = await User.find().select("-password"); // Exclude sensitive data like password
//     res.status(200).json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// userRouter.get("/:id", userAdminAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select(["-password", "-createdAt", "-updatedAt"]); // Exclude password from the result
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// })

// // PATCH: Update user information (Admin or the user themselves)
// userRouter.patch("/:id", userAdminAuth, async (req, res) => {
//   try {
//     const { username, email, password, role } = req.body;
//     const updateFields = {};

//     // Conditionally update fields if provided
//     if (username) updateFields.username = username;
//     if (email) updateFields.email = email;
//     if (role) updateFields.role = role;

//     // Hash password if provided
//     if (password) {
//       const salt = await bcrypt.genSalt(5);
//       updateFields.password = await bcrypt.hash(password, salt);
//     }

//     // Update the user in the database
//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.id,
//       updateFields,
//       {
//         new: true,
//         runValidators: true,
//       }
//     ).select("-password"); // Exclude password from the response

//     if (!updatedUser) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.status(200).json(updatedUser);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// userRouter.delete("/:id", adminAuth, async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// module.exports = {userRouter};
