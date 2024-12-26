import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

export const hashPassword = async (password: string): Promise<string>  => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error(error);
    return false;
  }
}

export const createJWTToken = (id: string): string => {
  return JWT.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
}