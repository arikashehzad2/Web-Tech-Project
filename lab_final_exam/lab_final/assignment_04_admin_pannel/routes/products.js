const express = require('express');
const router = express.Router();
const Product = require('../models/product');


// ================== MENU PAGE ==================
router.get('/', async (req, res) => {
  try {
    const perPage = 6;
    const page = parseInt(req.query.page) || 1;

    const products = await Product.find()
      .skip((page - 1) * perPage)
      .limit(perPage);

    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / perPage);

    res.render('menu', { products, page, totalPages });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

// ================== ADMIN DASHBOARD ==================
router.get('/dashboard', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    res.render('admin/dashboard', { totalProducts, isAdmin: true });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

// ================== ADMIN PRODUCT LIST ==================
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.render('admin/product_list', { products, isAdmin: true });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

// ================== ADD PRODUCT ==================
// Show add form
router.get('/products/add', (req, res) => {
  res.render('admin/add_product', { isAdmin: true });
});

// Handle form submission
router.post('/products/add', async (req, res) => {
  try {
    const { name, price, category, image, description } = req.body;
    const newProduct = new Product({ name, price, category, image, description });
    await newProduct.save();
    res.redirect('/admin/products');
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

// ================== EDIT PRODUCT ==================
// Show edit form
router.get('/products/edit/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send('Product not found');
    res.render('admin/edit_product', { product, isAdmin: true });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

// Handle edit submission
router.post('/products/edit/:id', async (req, res) => {
  try {
    const { name, price, category, image, description } = req.body;
    await Product.findByIdAndUpdate(req.params.id, { name, price, category, image, description });
    res.redirect('/admin/products');
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

// ================== DELETE PRODUCT ==================
router.post('/products/delete/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin/products');
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
