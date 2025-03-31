const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {User} = require("../models/user.model"); // Import your User model

const authRouter = express.Router();

// POST: Register a new member
authRouter.post("/register", async (req, res) => {
  try {
    const { username, password, name, email } = req.body;

    // Check if all required fields are provided
    if (!username || !password || !name || !email) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already in use" });
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
    const newUser = new User({
      username,
      password: hashedPassword,
      name,
      email,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Respond with user details (excluding password)
    res.status(201).json({
      id: savedUser._id,
      username: savedUser.username,
      name: savedUser.name,
      email: savedUser.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST: Authenticate user and issue JWT
authRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if both username and password are provided
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET, // Store the secret in a secure environment variable
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Respond with the token
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = {authRouter};
