const mongoose = require("mongoose");
const { Schema } = mongoose;
const taskSchema = new Schema({
  title: String,
  assignee: String,
  description: String,
  deadline: String,
  type: String,
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Task", taskSchema);
