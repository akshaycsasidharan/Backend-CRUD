import express from "express";
import {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
  reassign,
} from "../controllers/taskcontroller.js";

import { verifyToken, isUser, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", verifyToken, createTask);
router.put("/:id", verifyToken, isUser, updateTask);
router.delete("/:id", verifyToken, deleteTask);
router.put("/:id", verifyToken, isAdmin, reassign);
router.get("/", verifyToken, getTasks);

export default router;
