require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 3000;

// ================= MongoDB Connection =================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// ================= Middleware =================

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files (CSS, JS, Images)
app.use(express.static(path.join(__dirname, "public")));

// ================= Routes =================

// Import product routes
const productRoutes = require('./routes/products');

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

// Menu page (dynamic from MongoDB)
app.use('/menu', productRoutes);

// About page
app.get("/about", (req, res) => {
  res.render("about");
});

// ================= Server =================

app.listen(PORT, () => {
  console.log(`Scoopy Doo running at http://localhost:${PORT}`);
});
