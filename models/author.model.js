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
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

authorSchema.virtual("books", {
  ref: "Book",
  localField: "_id",
  foreignField: "author"
})

// Create and export the Author model
const Author = mongoose.model("author", authorSchema);
module.exports = {Author};
