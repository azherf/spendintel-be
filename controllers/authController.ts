import { Request, Response } from "express";
import { pool } from "../libs/database";
import { comparePassword, createJWTToken, hashPassword } from "../libs/utils";
import { UserResult } from "../types/user";

export const signupUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, firstName, password } = req.body;

    if (!email || !firstName || !password) {
      res.status(404).json({
        status: "error",
        message: "Provide required fields!",
      });
    }

    const result: UserResult = await pool.query({
      text: `SELECT EXISTS (SELECT * from "user" WHERE email = $1)`,
      values: [email],
    });

    if (result.rows[0].exists) {
      res.status(409).json({
        status: "error",
        message: "Email address already taken. Try another email address.",
      });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const userResult: UserResult = await pool.query({
      text: `INSERT INTO "user" ("email", "firstName", "password") VALUES ($1, $2, $3) RETURNING *`,
      values: [email, firstName, hashedPassword],
    });

    userResult.rows[0].password = undefined;

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: userResult.rows[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" }); // Send an error response
  }
};

export const signinUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(404).json({
        status: "error",
        message: "Provide required fields!",
      });
    }

    const result: UserResult = await pool.query({
      text: `SELECT * FROM "user" WHERE email = $1`,
      values: [email],
    });

    const user = result.rows[0];

    if (!user) {
      res.status(404).json({
        status: "error",
        message: "User not found",
      });
      return;
    }

    const isPasswordMatch = await comparePassword(password, user.password as string);

    if (!isPasswordMatch) {
      res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
      return;
    }

    // Create JWT token
    const token = createJWTToken(user.id, req.ip, req.get("User-Agent"));

    user.password = undefined;

    res.status(200).json({
      status: "success",
      message: "User signed in successfully",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" }); // Send an error response
  }
};
