import { Response } from "express";
import { pool } from "../libs/database";
import { AuthenticatedRequest } from "../types/express";
import { Category, CategoryResult } from "../types/category";

export const getCategories = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.body.user;
    const categoryResult: CategoryResult = await pool.query({
      text: `SELECT * FROM category WHERE ("userId" = $1 or "userId" IS NULL) and "deletedAt" IS NULL`,
      values: [userId],
    });

    res.status(200).json({
      status: "success",
      data: categoryResult.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export const getCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.body.user;
    const { id } = req.params;
    const categoryResult: CategoryResult = await pool.query({
      text: `SELECT * FROM category WHERE id = $1 and ("userId" = $2 or "userId" IS NULL) and "deletedAt" IS NULL`,
      values: [id, userId],
    });

    if (!categoryResult.rows[0]) {
      res.status(404).json({
        status: "error",
        message: "Category not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: categoryResult.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export const createCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userId} = req.body.user;
    const { name, description, type } = req.body;
    const categoryResult: CategoryResult = await pool.query({
      text: `INSERT INTO category ("userId", name, description, type) VALUES ($1, $2, $3, $4) RETURNING *`,
      values: [userId, name, description, type],
    });

    res.status(201).json({
      status: "success",
      data: categoryResult.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export const updateCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.body.user;
    const { id } = req.params;
    const { name, description, type } = req.body;
    const categoryResult: CategoryResult = await pool.query({
      text: `UPDATE category SET name = $1, description = $2, type = $3, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $4 and "userId" = $5 RETURNING *`,
      values: [name, description, type, id, userId],
    });

    if (!categoryResult.rows[0]) {
      res.status(404).json({
        status: "error",
        message: "Category not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: categoryResult.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export const deleteCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.body.user;
    const { id } = req.params;
    const categoryResult: CategoryResult = await pool.query({
      text: `UPDATE category SET "deletedAt" = CURRENT_TIMESTAMP WHERE id = $1 and "userId" = $2 RETURNING *`,
      values: [id, userId],
    });

    if (!categoryResult.rows[0]) {
      res.status(404).json({
        status: "error",
        message: "Category not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export const fetchCategories = async (userId: number): Promise<Category[]> => {
  try {
    const categoryResult: CategoryResult = await pool.query({
      text: `SELECT * FROM category WHERE ("userId" = $1 or "userId" IS NULL) and "deletedAt" IS NULL`,
      values: [userId],
    });

    return categoryResult.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}