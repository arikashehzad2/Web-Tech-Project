const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");

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
  const cart = req.session.cart;

  // Server-side validation
  if (!customerName || !email) {
    return res.send("Please provide name and email.");
  }

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const newOrder = new Order({
    customerName,
    email,
    items: cart.map(item => ({
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
    const order = await Order.findById(orderId).populate("items.product");
    res.render("order-confirmation", { order });
  } catch (err) {
    console.error(err);
    res.send("Order not found");
  }
});

module.exports = router;
