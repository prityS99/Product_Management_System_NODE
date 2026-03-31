const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  slug: {
    type: String,
    unique: true,
  },

  status: {
    type: String,
    enum: ["active", "inactive"], 
    default: "active",
  },

  isDeleted: {
    type: Boolean,
    default: false,
  }

}, { timestamps: true });

module.exports = mongoose.model("Category", CategorySchema);