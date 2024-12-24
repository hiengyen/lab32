const mongoose = require("mongoose");
const AdvertisementSchema = new mongoose.Schema({
  Owner: { type: String, required: true},
  Content: { type: String, required: true }
});
module.exports = mongoose.model("Advertisement", AdvertisementSchema);
