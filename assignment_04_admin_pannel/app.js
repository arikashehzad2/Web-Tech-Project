require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 3000;

// ================= MongoDB Connection =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ================= Middleware =================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Body parser for POST requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ================= Routes =================
const productRoutes = require('./routes/products');

// Home page
app.get("/", (req, res) => res.render("index"));

// About page
app.get("/about", (req, res) => res.render("about"));

// Menu page (dynamic)
app.use('/menu', productRoutes);

// Admin pages
app.use('/admin', productRoutes); // all admin routes start with /admin

// ================= Server =================
app.listen(PORT, () => {
  console.log(`Scoopy Doo running at http://localhost:${PORT}`);
});
