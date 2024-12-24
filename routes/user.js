const express = require("express");
const Ads = require("../models/Advertisements");
const path = require("path");

const router = express.Router();

// Middleware to check authentication
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

// User panel
router.get("/user", isAuthenticated, async (req, res) => {
  const ads = await Ads.find({ Owner: req.session.user.username });
  const username = req.session.user.username;
  res.render("user", { title: "User", ads, username });
});

// Create content
router.get("/user/create", isAuthenticated, (req, res) => {
  res.render(path.join(__dirname, "../views/create_ads.ejs"), {
    title: "User",
  });
});

router.post("/user/create", isAuthenticated, async (req, res) => {
  const { content } = req.body;
  await Ads.create({ Owner: req.session.user.username, Content: content });
  res.redirect("/user");
});

// Edit user
router.get("/user/edit/:id", isAuthenticated, async (req, res) => {
  const ad = await Ads.findById(req.params.id);
  res.render(path.join(__dirname, "../views/edit_ads.ejs"), {
    title: "User",
    ad,
  });
});

router.post("/user/edit/:id", isAuthenticated, async (req, res) => {
  const { content } = req.body;
  const updatedData = { Content: content };
  await Ads.findByIdAndUpdate(req.params.id, updatedData);
  res.redirect("/user");
});

// Delete user
router.get("/user/delete/:id", isAuthenticated, async (req, res) => {
  await Ads.findByIdAndDelete(req.params.id);
  res.redirect("/user");
});

module.exports = router;
