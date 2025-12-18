const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Route to fetch products with pagination
router.get('/', async (req, res) => {
  try {
    const perPage = 6; // 6 products per page
    const page = parseInt(req.query.page) || 1; // current page from query string, default = 1

    // Fetch products for current page
    const products = await Product.find()
      .skip((page - 1) * perPage)
      .limit(perPage);

    console.log("Fetched products from MongoDB:", products); // DEBUG: see fetched data in terminal

    // Total pages for pagination
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / perPage);

    // Render menu with products, current page, and total pages
    res.render('menu', { products, page, totalPages });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
