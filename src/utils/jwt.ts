import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' }); // Kedaluwarsa dalam 15 menit
};

export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' }); // Kedaluwarsa dalam 7 hari
};

export const verifyToken = (token: string, secret: 'access' | 'refresh') => {
  try {
    const secretKey = secret === 'access' ? ACCESS_SECRET : REFRESH_SECRET;
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
};