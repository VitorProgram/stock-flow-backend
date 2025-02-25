import { Request, Response } from "express";
import { prisma } from "lib/prisma";

export const createItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, quantity, categoryId } = req.body;

    if (!name || quantity === undefined || !categoryId) {
      res.status(400).json({ error: "Todos os campos são obrigatórios." });
      return;
    }

    // Verifica se a categoria existe
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      res.status(404).json({ error: "Categoria não encontrada." });
      return;
    }

    const item = await prisma.item.create({
      data: { name, quantity, categoryId },
    });

    res.status(201).json({ message: "Item criado!", item });
  } catch (error) {
    console.error("Erro ao criar item:", error);
    res.status(500).json({ error: "Erro interno ao criar item." });
  }
};

export const deleteItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; // Pegamos o ID dos parâmetros da URL

    if (!id) {
      res.status(400).json({ error: "ID do item é obrigatório" });
      return;
    }

    // Verifica se a categoria existe
    const item = await prisma.item.findUnique({
      where: { id },
    });

    if (!item) {
      res.status(404).json({ error: "Categoria não encontrada" });
      return;
    }

    // Deletando item
    await prisma.item.delete({ where: { id } });

    res.status(200).json({ message: "Item e seus itens deletados" });
  } catch (error) {
    console.error(`Erro ao deletar item: ${error}`);
    res.status(500).json({ error: `Erro ao deletar item. Erro: ${error}` });
  }
};

// Recebendo itens da categoria
export const getItem = async (req: Request, res: Response): Promise<void> => {
  try {
    // Id da categoria
    const { categoryId } = req.params;

    if (!categoryId) {
      res.status(400).json({ error: "O parâmetro categoryId é obrigatório." });
      return;
    }

    console.log(`categoryId recebido: ${categoryId}`);

    // Pegando os itens
    const items = await prisma.item.findMany({
      where: { categoryId: categoryId },
    });

    // Verificando se não existem itens
    if (items.length === 0) {
      res.status(404).json({ error: "Nenhum item encontrado." });
      return;
    }

    res.status(200).json(items);
    return;
  } catch (error) {
    res.status(404).json({ error: `Item não encontrado ${error}` });
    return;
  }
};
