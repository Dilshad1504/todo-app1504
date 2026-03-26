const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  text: String,
  isChecked: Boolean
});

module.exports = mongoose.model("Todo", todoSchema);