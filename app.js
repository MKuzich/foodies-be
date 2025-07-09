import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";

import "./db/sequelize.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import recipeRouter from "./routes/recipeRouter.js";
import followRouter from "./routes/followRoutes.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/users", followRouter);
app.use("/api/recipes", recipeRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});
