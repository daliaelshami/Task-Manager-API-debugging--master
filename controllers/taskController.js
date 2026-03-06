const Task = require("../models/Task");

// Bug: The function was using .then() which can lead to nested callbacks, and it lacked error handling (no .catch).
// Fix: Refactored to use async/await with a try/catch block for better error management.
exports.createTask = async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ msg: "Title is required" });

  try {
    const exist = await Task.findOne({ title });
    if (exist) return res.status(400).json({ msg: "Task already exists" });
    // Bug: Success status code was 200.
    // Fix: Changed to 201 to follow REST best practices for creating a resource.
    const task = await Task.create({ title });
    res.status(201).json({ msg: "Task Created", data: task });
  } catch (error) {
    // Bug: Errors during database operations were not handled.
    // Fix: Added a catch block to return a 500 status code on server/db errors.
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

// Bug: The function was using .then() which can lead to nested callbacks, and it lacked error handling (no .catch).
// Fix: Refactored to use async/await with a try/catch block for better error management.
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({ msg: "Tasks List", data: tasks });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};


exports.createTaskWithCheck = async (req, res) => {
  const { title } = req.body;

  // Bug: No error handling for database operations.
  // Fix: Wrapped the logic in a try/catch block to prevent server crashes.
  try {
    const exist = await Task.findOne({ title });
    if (exist) return res.status(400).json({ msg: "Task already exists" });

    const task = await Task.create({ title });
    res.status(201).json({ msg: "Task Created", data: task });
    
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};
