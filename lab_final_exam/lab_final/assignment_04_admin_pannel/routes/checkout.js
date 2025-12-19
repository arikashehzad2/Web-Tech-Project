const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/product");

// Import reusable middleware
const checkCartNotEmpty = require("../middleware/checkCartNotEmpty");

// Show checkout page
router.get("/", checkCartNotEmpty, (req, res) => {
  const cart = req.session.cart;
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.render("checkout", { cart, total });
});

// Handle checkout form submission
router.post("/", checkCartNotEmpty, async (req, res) => {
  const { customerName, email } = req.body;
  let cart = req.session.cart;

  // Server-side validation
  if (!customerName || !email) {
    return res.send("Please provide name and email.");
  }

  // Filter out deleted products
  const productIds = cart.map(item => item._id);
  const existingProducts = await Product.find({ _id: { $in: productIds } });
  const existingMap = {};
  existingProducts.forEach(p => existingMap[p._id] = p);

  const finalCart = cart
    .filter(item => existingMap[item._id])
    .map(item => ({
      ...item,
      price: existingMap[item._id].price,
      name: existingMap[item._id].name
    }));

  if (finalCart.length === 0) {
    req.session.cart = [];
    return res.send("All products in your cart were removed from the store.");
  }

  const totalAmount = finalCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const newOrder = new Order({
    customerName,
    email,
    items: finalCart.map(item => ({
      product: item._id,
      quantity: item.quantity,
      price: item.price
    })),
    totalAmount
  });

  try {
    const savedOrder = await newOrder.save();

    // Clear session cart
    req.session.cart = [];

    // Redirect to confirmation page
    res.redirect(`/checkout/confirmation/${savedOrder._id}`);
  } catch (err) {
    console.error(err);
    res.send("Error creating order. Please try again.");
  }
});

// Order confirmation page
router.get("/confirmation/:id", async (req, res) => {
  const orderId = req.params.id;
  try {
    // ✅ Populate product references so names/prices are available
    const order = await Order.findById(orderId).populate("items.product");
    res.render("order-confirmation", { order });
  } catch (err) {
    console.error(err);
    res.send("Order not found");
  }
});

module.exports = router;
