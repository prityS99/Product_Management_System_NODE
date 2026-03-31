const Product = require("../../models/products");
const Category = require("../../models/category");

class UserProductController {

  // HOME - List, Search, and Filter
  async home(req, res) {
    try {
      const { search, category } = req.query;
      let filter = { isDeleted: false };

      // 1. Handle Search Logic
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      // 2. Handle Category Filtering
      // Note: Use 'categoryId' to match your Schema field name
      if (category && category !== "") {
        filter.categoryId = category;
      }

      // 3. Fetch Data in Parallel
      // Changed .populate("category") to .populate("categoryId")
      const [products, categories] = await Promise.all([
        Product.find(filter).populate("categoryId").sort({ createdAt: -1 }),
        Category.find({ isDeleted: false })
      ]);

      res.render("user/home", { 
        products, 
        categories,
        selectedCategory: category || '',
        searchQuery: search || ''
      });

    } catch (error) {
      console.error("Home Page Error:", error);
      res.status(500).render("error", { message: "Could not load products" });
    }
  }

  // PRODUCT DETAILS - Find by Slug
  async productDetail(req, res) {
    try {
      const { slug } = req.params;

      // Changed .populate("category") to .populate("categoryId")
      const product = await Product.findOne({ 
        slug: slug, 
        isDeleted: false 
      }).populate("categoryId");

      if (!product) {
        return res.status(404).render("error", { message: "Product not found" });
      }

      res.render("user/productDetails", { product });

    } catch (error) {
      console.error("Product Detail Error:", error);
      res.status(500).render("error", { message: "Error loading product details" });
    }
  }
}

module.exports = new UserProductController();