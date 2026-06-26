import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { getCurrentUser } from "../controllers/user.controller.js";

const userRouter = express();

userRouter.get("/current-user", verifyToken, getCurrentUser);

export default userRouter;
