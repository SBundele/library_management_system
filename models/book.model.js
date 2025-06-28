const mongoose = require("mongoose");

// Create a book schema
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    ISBN: {
      type: String,
      unique: true,
      required: [true, "ISBN is required"],
      validate: {
        validator: function (value) {
          return /^[a-zA-Z0-9]{13}$/.test(value); // Ensures alphanumeric and length of 13
        },
        message: "ISBN must be alphanumeric and exactly 13 characters long",
      },
    },
    summary: {
      type: String,
    },
    publicationDate: {
      type: Date,
    },
    genres: {
      type: [String], // Array of strings
    },
    copiesAvailable: {
      type: Number,
      default: 1, // Default value is 1
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "author", // Replace "Author" with the name of your Author model
    },
    borrowedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
  },
  { 
    timestamps: true,
    versionKey: false 
  }
);

// Create and export the Book model
const Book = mongoose.model("Book", bookSchema);
module.exports = { Book };
