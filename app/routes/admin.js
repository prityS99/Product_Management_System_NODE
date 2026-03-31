const express = require("express");
const router = express.Router();
const CategoryController = require('../controllers/admin/category')
const ProductController = require('../controllers/admin/product')
const upload = require("../middleware/upload");

//  DASHBOARD //
router.get("/", async (req, res) => {res.render("admin/dashboard");});


// CATEGORY ROUTES 

// LIST //
router.get("/categories", CategoryController.getCategories);

// ADD //
router.post("/categories/add", CategoryController.createCategory);

// EDIT //
router.post("/categories/edit/:id", CategoryController.updateCategory);

// DELETE //
router.get("/categories/delete/:id", CategoryController.deleteCategory);



//  PRODUCT ROUTES 

// LIST //
router.get("/products", ProductController.getProducts);

// ADD //
router.post("/products/add",upload.single("image"), ProductController.addProduct);
//EJS //
router.get("/products/add", ProductController.addProductPage);
// EDIT //
router.post("/products/edit/:id",upload.single("image"), ProductController.updateProduct);
//EJS//

router.get("/products/edit/:id", ProductController.editProductPage);
// DELETE //
router.get("/products/delete/:id", ProductController.deleteProduct);


module.exports = router;