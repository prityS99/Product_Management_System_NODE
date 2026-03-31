require("dotenv").config();
const express = require("express");
const path = require("path");
const DatabaseConnection = require("./app/config/dbconfig");

const app = express();
const port = 3005;

// 1. DB CONNECTION
DatabaseConnection();

// 2. EJS SETUP
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 3. MIDDLEWARE (Order matters!)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. STATIC FILES
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 5. ROUTES
const adminRoute = require("./app/routes/admin");
const userRoute = require("./app/routes/user");

// Mount the routes
app.use("/admin", adminRoute); 
app.use("/", userRoute);

// 6. SERVER START
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});