import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategory,
} from "../controllers/category.controller";

const categoryRoutes = express.Router();

categoryRoutes.post("/", createCategory);
categoryRoutes.delete("/deleteCategory/:id", deleteCategory);
categoryRoutes.get("/:id", getCategory);

export default categoryRoutes;
