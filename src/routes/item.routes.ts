import express from "express";
import {
  createItem,
  deleteItem,
  getItem,
} from "src/controllers/items.controller";

const itemRoutes = express.Router();

// Rota para criar um item dentro de uma categoria
itemRoutes.post("/", createItem);
itemRoutes.delete("/deleteItem/:id", deleteItem);
itemRoutes.get("/:categoryId", getItem);

export default itemRoutes;
