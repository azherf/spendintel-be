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
    baseCurrency = baseCurrency ?? await determineBaseCurrency(userId, baseCurrency);
    convertedAmount = convertedAmount ?? await determineConvertedAmount(amount, convertedAmount, currency, baseCurrency);
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
    const { userId } = req.body.user;
    const { id } = req.params;
    const { description, amount, currency, categoryId, modeOfPaymentId, transactionDate } = req.body;
    let { convertedAmount, baseCurrency } = req.body;
    baseCurrency = baseCurrency ?? await determineBaseCurrency(userId, baseCurrency);
    convertedAmount = convertedAmount ?? await determineConvertedAmount(amount, convertedAmount, currency, baseCurrency);
    const transaction = await pool.query({
      text: `UPDATE transaction SET description = $1, amount = $2, currency = $3, "convertedAmount" = $4, "baseCurrency" = $5, "categoryId" = $6, "modeOfPaymentId" = $7, "transactionDate" = $8, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $9 and "userId" = $10 RETURNING *`,
      values: [description, amount, currency, convertedAmount, baseCurrency, categoryId, modeOfPaymentId, transactionDate, id, userId],
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

// Retrieve the defaultCurrency of the user
const determineBaseCurrency = async (userId: number, baseCurrency: string): Promise<string> => {
  const user = await pool.query({
    text: `SELECT * FROM "user" WHERE id = $1`,
    values: [userId],
  });
  return user.rows[0].defaultCurrency;
}

// Convert the amount to the base currency if the base currency is different from the currency
const determineConvertedAmount = async (amount: number, convertedAmount: number, currency: string, baseCurrency: string): Promise<number> => {
  if (baseCurrency === currency) {
    return amount;
  } else {
    const dbCurrencies = await pool.query({
      text: `SELECT * FROM currency WHERE code = $1 or code = $2`,
      values: [currency, baseCurrency],
    });
    const fromCurrencyRate = dbCurrencies.rows.find((dbCurrency) => dbCurrency.code === currency)?.exchangeRate;
    const toCurrencyRate = dbCurrencies.rows.find((dbCurrency) => dbCurrency.code === baseCurrency)?.exchangeRate;
    return convertCurrency({ amount, fromCurrencyRate, toCurrencyRate });
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