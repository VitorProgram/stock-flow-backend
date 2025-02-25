import { Request, Response } from "express";
import { prisma } from "lib/prisma";

// Requisição POST para alterar o nome do usuário
export const updateName = async (req: Request, res: Response) => {
  try {
    const { id, name } = req.body;

    if (!id || !name) {
      return res.status(400).json({ error: "ID e nome são obrigatórios." });
    }

    const updateNameUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name: name,
      },
    });

    res
      .status(200)
      .json({ message: "Nome atualizado com sucesso.", updateNameUser });
  } catch (error) {
    console.error("Erro ao criar item:", error);
    res.status(500).json({ error: "Erro interno ao criar item." });
  }
};
