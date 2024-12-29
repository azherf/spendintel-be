import { Response } from "express";
import { pool } from "../libs/database";
import { convertCurrency } from "../libs/utils";
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
    const { userId } = req.body.user;
    const { id } = req.params;
    const transaction = await pool.query({
      text: `SELECT * FROM transaction WHERE id = $1 and "userId" = $2 and "deletedAt" IS NULL`,
      values: [id, userId],
    });

    if (!transaction.rows[0]) {
      res.status(404).json({
        status: "error",
        message: "Transaction not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: transaction.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export const createTransaction = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.body.user;
    const { description, amount, currency, categoryId, modeOfPaymentId, transactionDate } = req.body;
    let { convertedAmount, baseCurrency } = req.body;
    // Check if baseCurrency is provided, if not, get the default currency of the user
    if (!baseCurrency) {
      const user = await pool.query({
        text: `SELECT * FROM "user" WHERE id = $1`,
        values: [userId],
      });
      baseCurrency = user.rows[0].defaultCurrency;
    }
    // Check if convertedAmount is provided, if not, convert the amount to baseCurrency
    if (!convertedAmount) {
      if (baseCurrency === currency) {
        convertedAmount = amount;
      } else {
        const dbCurrencies = await pool.query({
          text: `SELECT * FROM currency WHERE code = $1 or code = $2`,
          values: [currency, baseCurrency],
        });
        const fromCurrencyRate = dbCurrencies.rows.find((dbCurrency) => dbCurrency.code === currency)?.exchangeRate;
        const toCurrencyRate = dbCurrencies.rows.find((dbCurrency) => dbCurrency.code === baseCurrency)?.exchangeRate;
        convertedAmount = convertCurrency({ amount, fromCurrencyRate, toCurrencyRate });
      }
    }
    const transaction = await pool.query({
      text: `INSERT INTO transaction ("userId", description, amount, currency, "convertedAmount", "baseCurrency", "categoryId", "modeOfPaymentId", "transactionDate") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      values: [userId, description, amount, currency, convertedAmount, baseCurrency, categoryId, modeOfPaymentId, transactionDate],
    });

    res.status(201).json({
      status: "success",
      data: transaction.rows[0],
    });
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