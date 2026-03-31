
const Category = require("../../models/category");
const slugify = require('slugify');

class CategoryController {

  // CREATE //
  async createCategory(req, res) {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).send("Name is required");

      const slug = slugify(name, { lower: true, strict: true });

      await Category.create({ name, slug });
      
      // Redirecting to the admin list view
      res.redirect("/admin/categories");
    } catch (err) {
      console.error("Create Error:", err);
      res.status(500).send("Error creating category");
    }
  }

  // LIST //
  async getCategories(req, res) {
    try {
      const categories = await Category.find({ isDeleted: false });
      res.render("admin/categories", { categories });
    } catch (err) {
      console.error("Fetch Error:", err);
      res.status(500).send("Error fetching categories");
    }
  }

  // UPDATE //
  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const slug = slugify(name, { lower: true, strict: true });

      const updated = await Category.findByIdAndUpdate(id, { name, slug });
      
      if (!updated) return res.status(404).send("Category not found");

      res.redirect("/admin/categories");
    } catch (err) {
      console.error("Update Error:", err);
      res.status(500).send("Error updating category");
    }
  }

  // DELETE //
  async deleteCategory(req, res) {
    try {
      const { id } = req.params;

      const deleted = await Category.findByIdAndUpdate(id, { isDeleted: true });

      if (!deleted) return res.status(404).send("Category not found");

      res.redirect("/admin/categories");
    } catch (err) {
      console.error("Delete Error:", err);
      res.status(500).send("Error deleting category");
    }
  }
}

module.exports = new CategoryController();
