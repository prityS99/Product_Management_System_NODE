const Product = require("../../models/products");
const Category = require("../../models/category"); // Move this to the top
const slugify = require("slugify");
const cloudinary = require("../../config/cloudinary");

class ProductController {
  // GET //
  async getProducts(req, res) {
    try {
      const selectedCategory = req.query.category;
      let filter = { isDeleted: false };

      if (selectedCategory) {
        filter.categoryId = selectedCategory;
      }

      // Fetch products and categories in parallel for better performance
      const [products, categories] = await Promise.all([
        Product.find(filter).populate("categoryId").sort({ createdAt: -1 }),
        Category.find({ isDeleted: false }),
      ]);

      res.render("admin/products", {
        products,
        categories,
        selectedCategory,
      });
    } catch (error) {
      console.error("Fetch Error:", error);
      res.status(500).send("Error fetching products");
    }
  }

  // EJS //
  async addProductPage(req, res) {
    try {
      const categories = await Category.find({ isDeleted: false });
      res.render("admin/add-product", { categories });
    } catch (error) {
      res.redirect("/admin/products");
    }
  }

  // ADD PRODUCT

  async addProduct(req, res) {
    try {
      // 1. Clean the name input
      const rawName = req.body.name || req.body["name "];
      const name = rawName ? rawName.trim() : null;

      if (!name) {
        return res.status(400).send("Error: Product name is required.");
      }

      // 2. Generate a UNIQUE SLUG
      // Adding Date.now() ensures 'perfume-1711912345' is different from 'perfume'
      const baseSlug = slugify(name, { lower: true, strict: true });
      const slug = `${baseSlug}-${Math.floor(Math.random() * 1000) + Date.now()}`;

      let imageUrl = "";
      let publicId = "";

      if (req.file) {
        // For Cloudinary Storage
        imageUrl = req.file.path;
        publicId = req.file.filename;
      }

      await Product.create({
        name,
        slug, // Now unique!
        categoryId: req.body.categoryId,
        description: req.body.description,
        price: req.body.price,
        image: imageUrl,
        public_id: publicId,
        status: "active",
        isDeleted: false, // Ensure it's not hidden by default
      });

      res.redirect("/admin/products");
    } catch (error) {
      console.error("Add Product Error:", error);

      // Handle Duplicate Key error specifically
      if (error.code === 11000) {
        return res
          .status(400)
          .send(
            "Error: A product with this name already exists in our records.",
          );
      }

      res.status(500).send("Failed to add product: " + error.message);
    }
  }

  //   async addProduct(req, res) {
  //     try {
  //       // Fix potential space issue in name (from your previous terminal error)
  //       const name = (req.body.name || req.body['name '])?.trim();
  //       const { categoryId, description, price } = req.body;

  //       if (!name) {
  //         return res.status(400).send("Error: Product 'name' is required.");
  //       }

  //       const slug = slugify(name, { lower: true, strict: true });

  //       let imageUrl = "";
  //       let publicId = "";

  //       if (req.file) {
  //         // If using multer-storage-cloudinary, path is the URL
  //         imageUrl = req.file.path;
  //         publicId = req.file.filename;
  //       }

  //       await Product.create({
  //         name,
  //         slug,
  //         categoryId,
  //         description,
  //         price, // Added price support
  //         image: imageUrl,
  //         public_id: publicId,
  //         status: "active",
  //       });

  //       res.redirect("/admin/products");
  //     } catch (error) {
  //       console.error("Add Product Error:", error);
  //       res.status(500).send("Failed to add product: " + error.message);
  //     }
  //   }



  // EJS //
  async editProductPage(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).send("Product not found");

      const categories = await Category.find({ isDeleted: false });
      res.render("admin/edit-product", { product, categories });
    } catch (error) {
      res.redirect("/admin/products");
    }
  }

  //  UPDATE PRODUCT
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const name = req.body.name?.trim();
      const { categoryId, description, price } = req.body;

      const product = await Product.findById(id);
      if (!product) return res.status(404).send("Product not found");

      if (!name) return res.status(400).send("Product name is required");

      let imageUrl = product.image;
      let publicId = product.public_id;

      if (req.file) {
        // Only attempt to destroy if public_id exists in DB
        if (product.public_id) {
          try {
            await cloudinary.uploader.destroy(product.public_id);
          } catch (err) {
            console.error("Cloudinary Delete Error:", err);
          }
        }
        imageUrl = req.file.path;
        publicId = req.file.filename;
      }

      await Product.findByIdAndUpdate(id, {
        name,
        slug: slugify(name, { lower: true, strict: true }),
        categoryId,
        description,
        price,
        image: imageUrl,
        public_id: publicId,
      });

      res.redirect("/admin/products");
    } catch (error) {
      console.error("Update Error:", error);
      res.status(500).send("Update failed: " + error.message);
    }
  }

  // 6. DELETE PRODUCT (Soft Delete)
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      // Also find the product first if you want to delete the image from Cloudinary
      const product = await Product.findById(id);
      if (product && product.public_id) {
        // Optional: Keep image in Cloudinary even if soft deleted, or delete it now:
        // await cloudinary.uploader.destroy(product.public_id);
      }

      await Product.findByIdAndUpdate(id, { isDeleted: true });
      res.redirect("/admin/products");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting product");
    }
  }
}

module.exports = new ProductController();
