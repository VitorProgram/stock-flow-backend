import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "lib/prisma";
import { configDotenv } from "dotenv";

const JWT_SECRET = process.env.JWT_SECRET as string;
configDotenv();

// Criando usuário
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    res.status(201).json({ message: "Usuário criado!", user });
  } catch (error) {
    res.status(500).json({ error: `Erro ao criar usuário. Erro: ${error}` });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Verifica se o usuário existe
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado!" });
      return;
    }

    // Compara a senha enviada com a senha armazenada
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Credenciais inválidas!" });
      return;
    }

    // Gera um token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    // Retorna o token e os dados do usuário
    res.status(200).json({ message: "Login bem-sucedido!", token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

// Coletando dados de sessão do usuário
// Exemplo de como o backend pode responder com os dados do usuário
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Token não fornecido" });
      return;
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        categories: {
          select: {
            id: true,
            name: true,
            items: { select: { id: true, name: true, quantity: true } },
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: `Erro ao buscar usuário: ${error}` });
  }
};
