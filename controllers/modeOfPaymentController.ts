import { Response } from "express";
import { pool } from "../libs/database";
import { AuthenticatedRequest } from "../types/express";

export const getModesOfPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.body.user;
    const categories = await pool.query({
      text: `SELECT * FROM category WHERE ("userId" = $1 or "userId" IS NULL) and "deletedAt" IS NULL`,
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

export const getModeOfPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.body.user;
    const { id } = req.params;
    const category = await pool.query({
      text: `SELECT * FROM category WHERE id = $1 and ("userId" = $2 or "userId" IS NULL) and "deletedAt" IS NULL`,
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

export const createModeOfPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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

export const updateModeOfPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.body.user;
    const { id } = req.params;
    const { name, description, type } = req.body;
    const category = await pool.query({
      text: `UPDATE category SET name = $1, description = $2, type = $3, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $4 and "userId" = $5 RETURNING *`,
      values: [name, description, type, id, userId],
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

export const deleteModeOfPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.body.user;
    const { id } = req.params;
    const category = await pool.query({
      text: `UPDATE category SET "deletedAt" = CURRENT_TIMESTAMP WHERE id = $1 and "userId" = $2 RETURNING *`,
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
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}