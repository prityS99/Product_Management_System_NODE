const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
  categoryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Category",
    required: true 
  },
    description: String,
    image: String,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", ProductSchema);
