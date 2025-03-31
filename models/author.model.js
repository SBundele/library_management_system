const mongoose = require("mongoose");

// Create an author schema
const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    biography: { type: String },
    dateOfBirth: { type: Date },
    nationality: { type: String },
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book", // Replace "Book" with the actual Book model name
      },
    ],
  },
  { 
    timestamps: true, 
    versionKey: false 
  }
);

// Create and export the Author model
const Author = mongoose.model("Author", authorSchema);
module.exports = Author;
