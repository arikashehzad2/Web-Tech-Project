const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// Show cart page
router.get("/", (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.render("cart", { cart, total });
});

// Add product to cart
router.post("/add/:id", async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);

  if (!product) return res.send("Product not found");

  if (!req.session.cart) req.session.cart = [];

  // Prevent duplicates
  const existingItem = req.session.cart.find(item => item._id.toString() === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    req.session.cart.push({
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  res.redirect("/menu");
});

// Remove product from cart
router.post("/remove/:id", (req, res) => {
  const productId = req.params.id;
  req.session.cart = req.session.cart.filter(item => item._id.toString() !== productId);
  res.redirect("/cart");
});

module.exports = router;
