import JWT from "jsonwebtoken";
import { Request, Response } from "express";

const authMiddleware = async (req: Request | any, res: Response, next: () => void) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "auth_failed",
        message: "Unauthorized",
      });
    }
    const token = authHeader.split(" ")[1];

    const userToken = JWT.verify(token, process.env.JWT_SECRET) as any;

    // Check token expiration
    if (Date.now() >= userToken.exp * 1000) {
      return res.status(401).json({
        status: "auth_failed",
        message: "Token expired",
      });
    }

    // Verify IP and User-Agent
    if (userToken.ip !== req.ip || userToken.userAgent !== req.get("User-Agent")) {
      return res.status(401).json({
        status: "auth_failed",
        message: "Token mismatch",
      });
    }

    req.body.user = {
      userId: userToken.userId,
    };

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      status: "auth_failed",
      message: "Unauthorized",
    });
  }
};

export default authMiddleware;
