import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import itemRoutes from "./routes/item.routes";
import userRoutes from "./routes/user.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

app.get("/", (req, res) => {
  res.json({ message: "🏓 Pong! O servidor está rodando!" });
});

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, () => console.log(`🔥 Servidor rodando na porta ${PORT}`));
