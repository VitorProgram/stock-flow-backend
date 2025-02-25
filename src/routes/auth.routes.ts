import express from "express";
import {
  getUser,
  loginUser,
  registerUser,
} from "../controllers/auth.controller";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/getUser", getUser);

export default authRouter;
