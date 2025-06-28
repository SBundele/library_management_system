const mongoose = require("mongoose");

// Create a borrowingTransaction schema
const borrowingTransactionSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book", // Replace "Book" with the name of your Book model
      required: [true, "Book reference is required"],
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Replace "User" with the name of your User model
      required: [true, "Member (User) reference is required"],
    },
    borrowDate: {
      type: Date,
      default: Date.now, // Automatically sets borrowDate to the current date
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    returnDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["returned", "borrowed"],
      default: "borrowed", // Default status is "borrowed"
    },
  },
  { 
    timestamps: true,
    versionKey: false 
  }
); // Automatically adds createdAt and updatedAt fields

// Create and export the BorrowingTransaction model
const BorrowingTransaction = mongoose.model("BorrowingTransaction", borrowingTransactionSchema);
module.exports = BorrowingTransaction;
