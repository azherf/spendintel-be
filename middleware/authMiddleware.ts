import JWT from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        status: "auth_failed",
        message: "Unauthorized",
      });
      return;
    }
    const token = authHeader.split(" ")[1];

    const userToken = JWT.verify(token, process.env.JWT_SECRET as string) as any;

    // Check token expiration
    if (Date.now() >= userToken.exp * 1000) {
      res.status(401).json({
        status: "auth_failed",
        message: "Token expired",
      });
      return;
    }

    // Verify IP and User-Agent
    if (userToken.ip !== req.ip || userToken.userAgent !== req.get("User-Agent")) {
      res.status(401).json({
        status: "auth_failed",
        message: "Token mismatch",
      });
      return;
    }

    (req as any).user = {
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
