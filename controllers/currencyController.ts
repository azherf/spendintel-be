import { Request, Response } from "express";
import { pool } from "../libs/database";
import { Currency, CurrencyResult } from "../types/currency";

export const getCurrencies = async (req: Request, res: Response): Promise<void> => {
  try {
    const currencyResult: CurrencyResult = await pool.query({
      text: `SELECT * FROM "currency" WHERE active = true`,
    });

    res.status(200).json({
      status: "success",
      data: currencyResult.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export const fetchCurrencies = async (userId: number): Promise<Currency[]> => {
  try {
    const currencyResult: CurrencyResult = await pool.query({
      text: `SELECT * FROM "currency" WHERE active = true`,
    });

    return currencyResult.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}