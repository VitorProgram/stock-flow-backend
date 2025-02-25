import express from "express";
import { updateName } from "src/controllers/user.controller";

const userRoutes = express.Router();

// Rota para criar um item dentro de uma categoria
userRoutes.put("/update", updateName);

export default userRoutes;
