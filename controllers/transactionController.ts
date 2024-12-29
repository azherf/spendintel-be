import * as XLSX from "xlsx";
import { Response } from "express";
import { AuthenticatedRequest } from "../types/express";
import { pool } from "../libs/database";
import { convertCurrency } from "../libs/utils";
import { fetchCategories } from "./categoryController";
import { fetchModesOfPayment } from "./modeOfPaymentController";
import { fetchCurrencies } from "./currencyController";

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
    baseCurrency = baseCurrency ?? await determineBaseCurrency(userId);
    convertedAmount = convertedAmount ?? await determineConvertedAmount({ amount, currency, baseCurrency });
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
    baseCurrency = baseCurrency ?? await determineBaseCurrency(userId);
    convertedAmount = convertedAmount ?? await determineConvertedAmount({ amount, currency, baseCurrency });
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
const determineBaseCurrency = async (userId: number): Promise<string> => {
  const user = await pool.query({
    text: `SELECT * FROM "user" WHERE id = $1`,
    values: [userId],
  });
  return user.rows[0].defaultCurrency;
}

// Convert the amount to the base currency if the base currency is different from the currency
const determineConvertedAmount = async (options: { amount: number, currency: string, baseCurrency: string }): Promise<number> => {
  const { amount, currency, baseCurrency } = options;
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
    const { userId } = req.body.user;
    const { id } = req.params;
    const transaction = await pool.query({
      text: `UPDATE transaction SET "deletedAt" = CURRENT_TIMESTAMP WHERE id = $1 and "userId" = $2 RETURNING *`,
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
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export const getTransactionTemplate = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.body.user;

    //fetch categories, modes of payment and currencies
    const currencies = await fetchCurrencies(userId);
    const categories = await fetchCategories(userId);
    const modesOfPayment = await fetchModesOfPayment(userId);

    // Define the headers of the template
    const headers = ["Description", "Amount", "Currency", "Converted Amount", "Base Currency", "Category", "Mode of Payment", "Transaction Date"];

    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    const mainSheet = XLSX.utils.aoa_to_sheet([headers]);
    const currencySheet = XLSX.utils.aoa_to_sheet([["Currency"], ...currencies.map((currency) => [currency.code])]);
    const categorySheet = XLSX.utils.aoa_to_sheet([["ID", "Name"], ...categories.map((category) => [category.id, category.name])]);
    const modeOfPaymentSheet = XLSX.utils.aoa_to_sheet([["ID", "Name"], ...modesOfPayment.map((modeOfPayment) => [modeOfPayment.id, modeOfPayment.name])]);

    // Add the worksheets to the workbook
    XLSX.utils.book_append_sheet(workbook, mainSheet, "Transactions");
    XLSX.utils.book_append_sheet(workbook, currencySheet, "Currencies");
    XLSX.utils.book_append_sheet(workbook, categorySheet, "Categories");
    XLSX.utils.book_append_sheet(workbook, modeOfPaymentSheet, "Modes of Payment");

    //Create named ranges for the category, mode of payment and currency sheets
    workbook.Workbook = { Names: [] };
    workbook.Workbook.Names.push({
      Name: "Currencies",
      Ref: `Currencies!$A$2:$B${currencies.length + 1}`,
    });
    workbook.Workbook.Names.push({
      Name: "Categories",
      Ref: `Categories!$A$2:$B${categories.length + 1}`,
    });
    workbook.Workbook.Names.push({
      Name: "ModesOfPayment",
      Ref: `Modes of Payment!$A$2:$B${modesOfPayment.length + 1}`,
    });

    //Set data validation for the category, mode of payment and currency columns
    mainSheet["!dataValidation"] = {
      C2: {
        type: "list",
        formula1: "=Currencies",
      },
      E2: {
        type: "list",
        formula1: "=Currencies",
      },
      F2: {
        type: "list",
        formula1: "=Categories",
      },
      G2: {
        type: "list",
        formula1: "=ModesOfPayment",
      },
    }

    // Convert the workbook to a buffer
    const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Send the workbook as a response
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=transaction_template.xlsx");
    res.status(200).send(excelBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export const uploadTransactions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        status: "error",
        message: "Please upload a file",
      });
      return;
    }
    const { userId } = req.body.user;

    const workbook = XLSX.readFile(req.file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const transactions = XLSX.utils.sheet_to_json(worksheet);

    const dbCategories = await fetchCategories(userId);
    const dbModesOfPayment = await fetchModesOfPayment(userId);

    const newTransactions = transactions.map((transaction: any) => {
      const dbCategory = dbCategories.find((dbCategory) => dbCategory.id === transaction.Category);
      const dbModeOfPayment = dbModesOfPayment.find((dbModeOfPayment) => dbModeOfPayment.id === transaction["Mode of Payment"]);
      const baseCurrency = transaction["Base Currency"] ?? determineBaseCurrency(userId);
      return {
        userId,
        description: transaction.Description,
        amount: transaction.Amount,
        currency: transaction.Currency,
        convertedAmount: transaction["Converted Amount"] ?? determineConvertedAmount({ amount: transaction.Amount, currency: transaction.Currency, baseCurrency }),
        baseCurrency,
        categoryId: dbCategory,
        modeOfPaymentId: dbModeOfPayment,
        transactionDate: transaction["Transaction Date"],
      };
    });

    const newTransactionValues = newTransactions.map((transaction) => {
      return [
        transaction.userId,
        transaction.description,
        transaction.amount,
        transaction.currency,
        transaction.convertedAmount,
        transaction.baseCurrency,
        transaction.categoryId,
        transaction.modeOfPaymentId,
        transaction.transactionDate,
      ];
    });

    const newTransactionQuery = {
      text: `INSERT INTO transaction ("userId", description, amount, currency, "convertedAmount", "baseCurrency", "categoryId", "modeOfPaymentId", "transactionDate") VALUES ${newTransactionValues.map((transaction
      ) => `($${transaction.join(", $")})`).join(", ")}`,
      values: newTransactionValues.flat(),
    };

    await pool.query(newTransactionQuery);

    res.status(201).json({
      status: "success",
      message: `${newTransactions.length} transactions uploaded successfully`,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}