const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();
const path = require("path");

router.get("/login", (req, res) => {
  res.render(path.join(__dirname, "../views/login.ejs"), { title: "Login" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && (await bcrypt.compare(password, user.password))) {
    req.session.user = user;
    if (user.role === "admin") {
      res.redirect("/admin");
    } else {
      res.redirect("/user");
    }
  } else {
    res.send('Invalid username or password. <a href="/login">Try again</a>');
  }
});

router.get("/register", (req, res) => {
  res.render(path.join(__dirname, "../views/register.ejs"), {
    title: "Register",
  });
});

router.post("/register", async (req, res) => {
  const { username, password, confirmPwd } = req.body;
  const user = await User.findOne({ username });

  if (user) {
    res.send('Username already exists. <a href="/register">Try again</a>');
  } else if (password !== confirmPwd) {
    res.send('Passwords do not match. <a href="/register">Try again</a>');
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword, role: "user" });
    const newUser = await User.findOne({ username });
    req.session.user = newUser;
    res.redirect("/user");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.send('An error occurred. <a href="/login">Try again</a>');
    } else {
      res.redirect("/login"); // Chuyển hướng về trang đăng nhập
    }
  });
});

module.exports = router;
