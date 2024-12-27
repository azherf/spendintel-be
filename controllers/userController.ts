import { Response } from "express";
import { pool } from "../libs/database";
import { comparePassword, hashPassword } from "../libs/index";
import { AuthenticatedRequest } from "../types/express";

export const getUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await pool.query({
      text: `SELECT * FROM "user" WHERE id = $1`,
      values: [req.body.user.userId],
    });

    user.rows[0].password = undefined;

    res.status(200).json({
      status: "success",
      data: user.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const updateUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const user = await pool.query({
      text: `UPDATE "user" SET name = $1, email = $2 WHERE id = $3 RETURNING *`,
      values: [name, email, id],
    });

    user.rows[0].password = undefined;

    res.status(200).json({
      status: "success",
      data: user.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await pool.query({
      text: `SELECT * FROM "user" WHERE id = $1`,
      values: [req.body.user.userId],
    });

    const isPasswordMatch = await comparePassword(oldPassword, user.rows[0].password);

    if (!isPasswordMatch) {
      res.status(401).json({
        status: "error",
        message: "Invalid password",
      });
      return;
    }

    const hashedPassword = await hashPassword(newPassword);

    const updatedUser = await pool.query({
      text: `UPDATE "user" SET password = $1 WHERE id = $2 RETURNING *`,
      values: [hashedPassword, req.body.user.userId],
    });

    updatedUser.rows[0].password = undefined;

    res.status(200).json({
      status: "success",
      data: updatedUser.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}