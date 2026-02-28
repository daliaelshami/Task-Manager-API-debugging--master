const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});
// Bug: String in isCompleted should be Boolean
// Fix: change type to Boolean and set default value to false

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
