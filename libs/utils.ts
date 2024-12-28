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

export const createJWTToken = (userId: string, ip: string | undefined, userAgent: string | undefined): string => {
  const nonce = Math.random().toString(36).substring(7);
  return JWT.sign(
    { userId, ip, userAgent, nonce },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

export const convertCurrency = (options: { amount: number, fromCurrencyRate: number, toCurrencyRate: number }): number => {
  return (options.amount * options.fromCurrencyRate) / options.toCurrencyRate;
}