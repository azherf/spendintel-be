import { Request, Response } from "express";
import { pool } from "../libs/database";

export const getCurrencies = async (req: Request, res: Response): Promise<void> => {
  try {
    const currencies = await pool.query({
      text: `SELECT * FROM "currency" WHERE active = true`,
    });

    res.status(200).json({
      status: "success",
      data: currencies.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export const fetchCurrencies = async (userId: number): Promise<any> => {
  try {
    const currencies = await pool.query({
      text: `SELECT * FROM "currency" WHERE active = true`,
    });

    return currencies.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}