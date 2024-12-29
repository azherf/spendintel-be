import { Request } from "express";
import { Multer } from "multer";

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
  };
  file?: Multer.File;
}
