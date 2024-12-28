import { Response } from "express";
import { pool } from "../libs/database";
import { AuthenticatedRequest } from "../types/express";

export const getTransactions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.body.user;
    const transactions = await pool.query({
      text: `SELECT * FROM transaction WHERE "userId" = $1 and "deletedAt" IS NULL`,
      values: [userId],
    });

    res.status(200).json({
      status: "success",
      data: transactions.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export const getTransaction = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // TODO: Implement getTransaction controller
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export const createTransaction = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // TODO: Implement createTransaction controller
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export const updateTransaction = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // TODO: Implement updateTransaction controller
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export const deleteTransaction = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // TODO: Implement deleteTransaction controller
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export const getTransactionTemplate = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // TODO: Implement getTransactionTemplate controller
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export const uploadTransactions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // TODO: Implement uploadTransactions controller
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}