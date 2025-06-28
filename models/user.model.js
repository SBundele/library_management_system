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
    }
  },
  { 
    timestamps: true, 
    versionKey: false,
    toJSON: {virtuals: true},
    toObject: {virtuals: true} 
 }
);

// ✅ Virtual field: borrowedBooks from BorrowingTransaction
userSchema.virtual("borrowedBooks", {
  ref: "BorrowingTransaction",
  localField: "_id",
  foreignField: "member",
});

// Create and export the model
const User = mongoose.model("User", userSchema);
module.exports = {User};


// validate: {
//   validator: function (value) {
//     return /^[a-zA-Z0-9]+$/.test(value); // Regex for alphanumeric
//   },
//   message: "Password must be alphanumeric",
// },