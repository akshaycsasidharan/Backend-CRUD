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

export const reassign = async (req, res) => {
  const id = req.params.id;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    task.assignees = req.body.assignees;
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { status, priority, assignees, dueDate, sortBy, order } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (assignees) {
      filter.assignees = { $in: assignees.split(",") };
    }

    if (dueDate) {
      filter.dueDate = { $lte: new Date(dueDate) };
    }

    const sort = {};
    if (sortBy) {
      sort[sortBy] = order === "desc" ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    const tasks = await Task.find(filter).sort(sort);

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
