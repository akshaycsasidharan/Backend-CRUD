import Task from "../models/taskmodel.js";
import User from "../models/usermodel.js";

export const createTask = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { title, description, priority, dueDate, status, assignees } =
      req.body;

    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      status,
      assignees,
      createdBy: user.username,
      updatedBy: user.username,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  const id = req.params.id;

  try {
    const task = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  const id = req.params.id;
  try {
    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
