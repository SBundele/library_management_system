const express = require("express");
const { Author } = require("../models/author.model");
const { Book } = require("../models/book.model");
const {
  adminAuth,
  userAdminAuth,
  authenticate,
} = require("../middlewares/auth.middleware");

const authorRouter = express.Router();

// POST: Create a new author
authorRouter.post("/create", adminAuth, async (req, res) => {
  try {
    const { name, biography, dateOfBirth, nationality } = req.body;

    // Check if name is provided (as it's required)
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Create a new author instance
    const newAuthor = new Author({
      name,
      biography,
      dateOfBirth,
      nationality,
    });

    // Save the author to the database
    const savedAuthor = await newAuthor.save();

    // Respond with the created author details
    res.status(201).json(savedAuthor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

authorRouter.get("/all", async (req, res) => {
  try {
    const authors = await Author.find(); // Retrieve all authors
    res.status(200).json({ authors });
  } catch (error) {
    console.error("Error retrieving authors:", error);
    res.status(500).json({ error: "Server error" });
  }
});

authorRouter.get("/:id", async (req, res) => {
  try {
    // Find the author by ID and populate the 'books' field so that book details are included
    const author = await Author.findById(req.params.id).populate("books");

    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }

    res.status(200).json(author);
  } catch (error) {
    console.error("Error retrieving author:", error);
    res.status(500).json({ error: "Server error" });
  }
});

authorRouter.put("/:id", authenticate, adminAuth, async (req, res) => {
  try {
    const { name, biography, dateOfBirth, nationality } = req.body;
    const updateFields = {};

    // Add provided fields to the update object.
    if (name) updateFields.name = name;
    if (biography) updateFields.biography = biography;
    if (dateOfBirth) updateFields.dateOfBirth = dateOfBirth;
    if (nationality) updateFields.nationality = nationality;

    // Find the author by ID and update with new fields.
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true } // new: returns the updated document; runValidators: enforce schema validations
    );

    if (!updatedAuthor) {
      return res.status(404).json({ error: "Author not found" });
    }

    res.status(200).json(updatedAuthor);
  } catch (error) {
    console.error("Error updating author:", error);
    res.status(500).json({ error: "Server error" });
  }
});

authorRouter.delete("/:id", authenticate, adminAuth, async (req, res) => {
  try {
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);

    if (!deletedAuthor) {
      return res.status(404).json({ error: "Author not found" });
    }

    res.status(200).json({ message: "Author deleted successfully" });
  } catch (error) {
    console.error("Error deleting author:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = { authorRouter };
