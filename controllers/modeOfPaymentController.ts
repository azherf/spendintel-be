import { Response } from "express";
import { pool } from "../libs/database";
import { AuthenticatedRequest } from "../types/express";
import { ModeOfPayment, ModeOfPaymentResult } from "../types/modeOfPayment";

export const getModesOfPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.body.user;
    const modesOfPaymentResult: ModeOfPaymentResult = await pool.query({
      text: `SELECT * FROM mode_of_payment WHERE ("userId" = $1 or "userId" IS NULL) and "deletedAt" IS NULL`,
      values: [userId],
    });

    res.status(200).json({
      status: "success",
      data: modesOfPaymentResult.rows,
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
    const modeOfPaymentResult: ModeOfPaymentResult = await pool.query({
      text: `SELECT * FROM mode_of_payment WHERE id = $1 and ("userId" = $2 or "userId" IS NULL) and "deletedAt" IS NULL`,
      values: [id, userId],
    });

    if (!modeOfPaymentResult.rows[0]) {
      res.status(404).json({
        status: "error",
        message: "Mode of payment not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: modeOfPaymentResult.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export const createModeOfPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userId} = req.body.user;
    const { name, description } = req.body;
    const modeOfPaymentResult: ModeOfPaymentResult = await pool.query({
      text: `INSERT INTO mode_of_payment ("userId", name, description) VALUES ($1, $2, $3) RETURNING *`,
      values: [userId, name, description],
    });

    res.status(201).json({
      status: "success",
      data: modeOfPaymentResult.rows[0],
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
    const { name, description } = req.body;
    const modeOfPaymentResult: ModeOfPaymentResult = await pool.query({
      text: `UPDATE mode_of_payment SET name = $1, description = $2, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $3 and "userId" = $4 RETURNING *`,
      values: [name, description, id, userId],
    });

    if (!modeOfPaymentResult.rows[0]) {
      res.status(404).json({
        status: "error",
        message: "Mode of payment not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: modeOfPaymentResult.rows[0],
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
    const modeOfPaymentResult: ModeOfPaymentResult = await pool.query({
      text: `UPDATE mode_of_payment SET "deletedAt" = CURRENT_TIMESTAMP WHERE id = $1 and "userId" = $2 RETURNING *`,
      values: [id, userId],
    });

    if (!modeOfPaymentResult.rows[0]) {
      res.status(404).json({
        status: "error",
        message: "Mode of payment not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Mode of payment deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export const fetchModesOfPayment = async (userId: string): Promise<ModeOfPayment[]> => {
  try {
    const modesOfPaymentResult: ModeOfPaymentResult = await pool.query({
      text: `SELECT * FROM mode_of_payment WHERE ("userId" = $1 or "userId" IS NULL) and "deletedAt" IS NULL`,
      values: [userId],
    });

    return modesOfPaymentResult.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}