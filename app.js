const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// ================= Middleware =================

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files (CSS, JS, Images)
app.use(express.static(path.join(__dirname, "public")));

// ================= Routes =================

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

// Menu page
app.get("/menu", (req, res) => {
  res.render("menu");
});

// About page
app.get("/about", (req, res) => {
  res.render("about");
});

// ================= Server =================

app.listen(PORT, () => {
  console.log(`Scoopy Doo running at http://localhost:${PORT}`);
});
