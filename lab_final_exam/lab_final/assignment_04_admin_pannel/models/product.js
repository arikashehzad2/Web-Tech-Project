const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Scoopy Bites", "Scoopy Cones", "Scoopy Sundaes"],
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// Prevent OverwriteModelError
module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);
