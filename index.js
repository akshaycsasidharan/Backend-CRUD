import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import UserRoutes from "./routes/userroute.js";
import TaskRoutes from "./routes/taskroute.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/user", UserRoutes);
app.use("/api/task", TaskRoutes);

const PORT = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    });
    console.log("successfully connected to database");
  })
  .catch((error) => {
    console.log("connection failed", error);
  });
