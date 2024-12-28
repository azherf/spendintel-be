import { Response } from "express";
import { pool } from "../libs/database";
import { AuthenticatedRequest } from "../types/express";

export const getCategories = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Get user ID from request body
    // Get all categories from the database
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export const createCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Get user ID from request body
    // Get category name from request body
    // Create category in the database
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export const updateCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Get user ID from request body
    // Get category ID from request body
    // Update category in the database
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export const deleteCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Get user ID from request body
    // Get category ID from request body
    // Delete category from the database
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}