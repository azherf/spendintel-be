import { Response } from "express";
import { pool } from "../libs/database";
import { comparePassword, hashPassword } from "../libs/utils";
import { AuthenticatedRequest } from "../types/express";
import { UserResult } from "../types/user";

export const getUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.body.user;
    const user: UserResult = await pool.query({
      text: `SELECT * FROM "user" WHERE id = $1`,
      values: [userId],
    });

    if (!user.rows[0]) {
      res.status(404).json({
        status: "error",
        message: "User not found",
      });
      return;
    }

    user.rows[0].password = undefined;

    res.status(200).json({
      status: "success",
      data: user.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export const updateUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.body.user;
    const { firstName, lastName, contact, country, defaultCurrency } = req.body;

    const user: UserResult = await pool.query({
      text: `SELECT * FROM "user" WHERE id = $1`,
      values: [userId],
    });

    if (!user.rows[0]) {
      res.status(404).json({
        status: "error",
        message: "User not found",
      });
      return;
    }

    const updatedUser: UserResult = await pool.query({
      text: `UPDATE "user" SET "firstName" = $1, "lastName" = $2, "contact" = $3, "country" = $4, "defaultCurrency" = $5, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *`,
      values: [firstName, lastName, contact, country, defaultCurrency, userId],
    });

    updatedUser.rows[0].password = undefined;

    res.status(200).json({
      status: "success",
      data: updatedUser.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.body.user;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    const user: UserResult = await pool.query({
      text: `SELECT * FROM "user" WHERE id = $1`,
      values: [userId],
    });

    if (!user.rows[0]) {
      res.status(404).json({
        status: "error",
        message: "User not found",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      res.status(400).json({
        status: "error",
        message: "Passwords do not match",
      });
      return;
    }

    const isPasswordMatch = await comparePassword(currentPassword, user.rows[0].password as string);

    if (!isPasswordMatch) {
      res.status(401).json({
        status: "error",
        message: "Invalid password",
      });
      return;
    }

    const hashedPassword = await hashPassword(newPassword);

    await pool.query({
      text: `UPDATE "user" SET "password" = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $2`,
      values: [hashedPassword, userId],
    });

    res.status(200).json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}