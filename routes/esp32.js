const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();

let commands = {};
router.use(bodyParser.json());

router.get("/publish", (req, res) => {
  const deviceId = req.query.device_id;
  if (deviceId && commands[deviceId]) {
    res.send(commands[deviceId]);
    commands[deviceId] = "";
  } else {
    res.send("");
  }
});

router.post("/publish", (req, res) => {
  const deviceId = req.body.device_id;
  const content = req.body.content;

  if (deviceId && content) {
    commands[deviceId] = content;
    res.send("Command published");
  } else {
    res.status(400).send("Invalid request");
  }
});

module.exports = router;
