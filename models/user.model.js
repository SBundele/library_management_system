const mongoose = require('mongoose');

// Create a user schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Username is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      validate: {
        validator: function (value) {
          return /^[a-zA-Z0-9]+$/.test(value); // Regex for alphanumeric
        },
        message: "Password must be alphanumeric",
      },
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
    },
    borrowedBooks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
  },
  { 
    timestamps: true, 
    versionKey: false  
 }
);

// Create and export the model
const User = mongoose.model("User", userSchema);
module.exports = {User};