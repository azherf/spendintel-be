import { Request, Response } from "express";
import { pool } from "../libs/database";
import { comparePassword, createJWTToken, hashPassword } from "../libs/index";

export const signupUser = async (req: Request, res: Response): Promise<Response | undefined> => {
  try {
    const { email, firstName, password } = req.body;

    if (!email || !firstName || !password) {
      res.status(404).json({
        status: "error",
        message: "Provide required fields!",
      });
    }

    const result = await pool.query({
      text: `SELECT EXISTS (SELECT * from "user" WHERE email = $1)`,
      values: [email],
    });

    if (result.rows[0].exists) {
      return res.status(409).json({
        status: "error",
        message: "Email address already taken. Try another email address.",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await pool.query({
      text: `INSERT INTO "user" ("email", "firstName", "password") VALUES ($1, $2, $3) RETURNING *`,
      values: [email, firstName, hashedPassword],
    });

    user.rows[0].password = undefined;

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: user.rows[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" }); // Send an error response
  }
};

export const signinUser = async (req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(404).json({
        status: "error",
        message: "Provide required fields!",
      });
    }

    const result = await pool.query({
      text: `SELECT * FROM "user" WHERE email = $1`,
      values: [email],
    });

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const isPasswordMatch = await comparePassword(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
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


// export const signinUser = async (req: Request, res: Response) => {
//   try {
//     // Your signin logic here
//     // For example, verify user credentials

//     res.status(200).json({ message: "User signed in successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" }); // Send an error response
//   }
// };
