import Task from "../models/taskmodel.js";
import User from "../models/usermodel.js";
import { io } from "../app.js";

const notifyClients = (event, task) => {
  io.emit(event, task);
};

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

    notifyClients("taskCreated", task);

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

    notifyClients("taskUpdated", task);

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.findByIdAndDelete(id);

    notifyClients("taskDeleted", task);

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

    notifyClients("taskReassigned", task);

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

export const tasksget = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const { search } = req.query;

    const searchQuery = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const tasks = await Task.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .exec();

    const totalTasks = await Task.countDocuments(searchQuery);

    const totalPages = Math.ceil(totalTasks / limit);

    res.json({
      tasks,
      currentPage: Number(page),
      totalPages,
      totalTasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
