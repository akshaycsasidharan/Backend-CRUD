import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import { Server as SocketIOServer } from "socket.io";
import UserRoutes from "./routes/userroute.js";
import TaskRoutes from "./routes/taskroute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const io = new SocketIOServer(server);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.use("/api/user", UserRoutes);
app.use("/api/task", TaskRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Successfully connected to database");
  })
  .catch((error) => {
    console.log("Connection failed", error);
  });

export { io };
