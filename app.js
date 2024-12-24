const express = require("express");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const path = require("path");
const WebSocket = require("ws");
const http = require("http");

const app = express();
const PORT = 3000;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

//int db
require("./config/db");

app.use(express.json());

wss.on("connection", (ws) => {
  console.log("Client connected to WebSocket");

  // Gửi dữ liệu mới tới client mỗi 1 giây
  ws.on("message", (message) => {
    console.log(`Message from client: ${message}`);
  });

  ws.send(JSON.stringify({ message: "Welcome to WebSocket!" }));
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: true,
  }),
);

// Set view Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout.ejs");
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use(require("./routes/auth"));
app.use(require("./routes/admin"));
app.use(require("./routes/user"));
app.use(require("./routes/esp32"));

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = { app, server, wss };
