import { Request, Response } from "express";
import { prisma } from "lib/prisma";

// Criando uma nova categoria
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, userId } = req.body;

    const category = await prisma.category.create({
      data: { name, userId },
    });

    res.status(201).json({ message: "Categoria criada!", category });
  } catch (error) {
    res.status(500).json({ error: `Erro ao criar categoria. Erro: ${error}` });
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; // Pegamos o ID dos parâmetros da URL

    if (!id) {
      res.status(400).json({ error: "ID da categoria é obrigatório" });
      return;
    }

    // Verifica se a categoria existe
    const category = await prisma.category.findUnique({
      where: { id },
      select: {
        items: {
          select: { id: true },
        },
      },
    });

    if (!category) {
      res.status(404).json({ error: "Categoria não encontrada" });
      return;
    }

    // Se não houver itens, deletamos diretamente
    if (category.items.length === 0) {
      await prisma.category.delete({ where: { id } });
      res.status(200).json({ message: "Categoria deletada com sucesso" });
      return;
    }

    // Se houver itens, deletamos primeiro os itens e depois a categoria
    await prisma.item.deleteMany({ where: { categoryId: id } });
    await prisma.category.delete({ where: { id } });

    res.status(200).json({ message: "Categoria e seus itens deletados" });
  } catch (error) {
    console.error(`Erro ao deletar categoria: ${error}`);
    res
      .status(500)
      .json({ error: `Erro ao deletar categoria. Erro: ${error}` });
  }
};

// Recebendo as categorias
export const getCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params; // Pega o userId a partir da URL

  console.log("ID:", id); // Log para debug

  if (!id) {
    res.status(400).json({ error: "O parâmetro id é obrigatório." });
    return;
  }

  try {
    const category = await prisma.category.findUnique({
      where: {
        id, // Faz a consulta filtrando pelo id
      },
      select: {
        id: true,
        name: true,
        items: {
          select: {
            id: true,
            name: true,
            quantity: true,
          },
        },
      },
    });

    res.status(200).json({ category });
    return;
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erro ao buscar categoria. Detalhes: " + error });
    return;
  }
};
