
const express = require("express");
const router = express.Router();
const UserProductController = require("../controllers/users/productController");

// HOME //
router.get("/", UserProductController.home);

// PRODUCTS DETAILS //
router.get("/product/:slug", UserProductController.productDetail);


//EJS//

router.get("/home", UserProductController.home); 

module.exports = router;