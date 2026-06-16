import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/auth.types";
import envConfig from "../../config/env.config";

export const generateAccessToken = (user: JwtPayload) => {
  return jwt.sign(
    { email: user.email, id: user.id, role: user.role },
    envConfig.JWT_SECRET,
    {
      expiresIn: (envConfig.JWT_EXPIERS_IN || "5m") as jwt.SignOptions["expiresIn"],
    }
  );
};

export const generateRefreshToken = (user: JwtPayload) => {
  return jwt.sign(
    { email: user.email, id: user.id, role: user.role },
    envConfig.JWT_SECRET,
    {
      expiresIn: (envConfig.JWT_EXPIERS_IN || "7d") as jwt.SignOptions["expiresIn"],
    }
  );
};