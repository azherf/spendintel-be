import { Response } from "express";
import { pool } from "../libs/database";
import { AuthenticatedRequest } from "../types/express";

/* /categories */
export const getCategories = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.body.user;
    const categories = await pool.query({
      text: `SELECT * FROM category WHERE "userId" = $1 or "userId" IS NULL and "deletedAt" IS NULL`,
      values: [userId],
    });

    res.status(200).json({
      status: "success",
      data: categories.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

/* /categories/{id} */
export const getCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.body.user;
    const { id } = req.params;
    const category = await pool.query({
      text: `SELECT * FROM category WHERE id = $1 and "userId" = $2 or "userId" IS NULL and "deletedAt" IS NULL`,
      values: [id, userId],
    });

    if (!category.rows[0]) {
      res.status(404).json({
        status: "error",
        message: "Category not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: category.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

/* /categories */
export const createCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userId} = req.body.user;
    const { name, description, type } = req.body;
    const category = await pool.query({
      text: `INSERT INTO category ("userId", name, description, type) VALUES ($1, $2, $3, $4) RETURNING *`,
      values: [userId, name, description, type],
    });

    res.status(201).json({
      status: "success",
      data: category.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export const updateCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Get user ID from request body
    // Get category ID from request body
    // Update category in the database
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export const deleteCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Get user ID from request body
    // Get category ID from request body
    // Delete category from the database
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}