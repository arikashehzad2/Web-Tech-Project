const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Import adminOnly middleware
const adminOnly = require("../middleware/adminOnly");

// Apply adminOnly to all routes in this file
router.use(adminOnly);

// ================= ADMIN ORDERS DASHBOARD =================
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate("items.product");
    res.render("admin/orders", { orders, isAdmin: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// ================= UPDATE ORDER STATUS =================
router.post("/update/:id", async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body; // status = "Confirmed" or "Cancelled"

  if (!["Confirmed", "Cancelled"].includes(status)) {
    return res.send("Invalid status");
  }

  try {
    await Order.findByIdAndUpdate(orderId, { status });
    res.redirect("/admin/orders");
  } catch (err) {
    console.error(err);
    res.send("Error updating order status");
  }
});

module.exports = router;
