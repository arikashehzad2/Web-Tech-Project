require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const adminOnly = require("./middleware/adminOnly");

const app = express();
const PORT = 3000;

// ================= MongoDB Connection =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ================= Middleware =================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // correct path
app.use(express.static(path.join(__dirname, "public")));

// Body parser for POST requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ================= Session =================
app.use(
  session({
    secret: "scoopy_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
  })
);
// Initialize cart in session
app.use((req, res, next) => {
  if (!req.session.cart) req.session.cart = [];
  next();
});

// ================= Session =================
app.use(
  session({
    secret: "scoopy_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
  })
);

// Make session available in all views
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});


// ================= Routes =================
const productRoutes = require("./routes/products");
const checkoutRoutes = require("./routes/checkout");
const adminOrdersRoutes = require("./routes/adminOrders");
const cartRoutes = require("./routes/cart");

// Home page
app.get("/", (req, res) => res.render("index"));

// About page
app.get("/about", (req, res) => res.render("about"));

// Menu page (dynamic)
app.use("/menu", productRoutes);

// Admin pages (products)
app.use("/admin", productRoutes);

// Checkout
app.use("/checkout", checkoutRoutes);

// Admin orders with adminOnly middleware
app.use("/admin/orders", adminOnly, adminOrdersRoutes);

// Cart
app.use("/cart", cartRoutes);

// ================= Server =================
app.listen(PORT, () => {
  console.log(`Scoopy Doo running at http://localhost:${PORT}`);
});
