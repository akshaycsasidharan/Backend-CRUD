import express from "express";
import {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
} from "../controllers/taskcontroller.js";

import { verifyToken, isUser } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", verifyToken, createTask);
router.put("/:id", verifyToken, isUser, updateTask);
router.delete("/:id", verifyToken, deleteTask);
router.get("/", verifyToken, getTasks);

export default router;
