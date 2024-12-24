const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Ads = require("../models/Advertisements");
const path = require("path");

const router = express.Router();

// Middleware to check authentication
function isAuthenticated(req, res, next) {
  if (req.session.user && req.session.user.role === "admin") {
    next();
  } else {
    res.redirect("/login");
  }
}

// Admin panel
router.get("/admin", isAuthenticated, async (req, res) => {
  const users = await User.find({
    username: { $ne: req.session.user.username },
  });
  res.render("admin", { title: "Admin", users });
});

// Create user
router.get("/admin/create", isAuthenticated, (req, res) => {
  res.render(path.join(__dirname, "../views/create_user.ejs"), {
    title: "Admin",
  });
});

router.post("/admin/create", isAuthenticated, async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ username, password: hashedPassword, role });
  res.redirect("/admin");
});

// Edit user
router.get("/admin/edit/:id", isAuthenticated, async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render(path.join(__dirname, "../views/edit_user.ejs"), {
    title: "Admin",
    user,
  });
});

router.post("/admin/edit/:id", isAuthenticated, async (req, res) => {
  const { username, password, role } = req.body;
  const updatedData = { username, password, role };
  if (password) {
    updatedData.password = await bcrypt.hash(password, 10);
  }
  await User.findByIdAndUpdate(req.params.id, updatedData);
  res.redirect("/admin");
});

// Delete user
router.get("/admin/delete/:id", isAuthenticated, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect("/admin");
});

router.get("/admin/advertisements", isAuthenticated, async (req, res) => {
  const ads = await Ads.find();
  res.render(path.join(__dirname, "../views/advertisements.ejs"), {
    title: "Advertisements",
    ads,
  });
});

module.exports = router;
