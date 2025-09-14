import { Request, Response } from 'express';
import {
  findAllUsers,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from './auth.service';
import { JwtPayload } from 'jsonwebtoken';
import { prisma } from '../../config/prisma';

export const registerController = async (req: Request, res: Response) => {
  try {
    const newUser = await registerUser(req.body);
    res.status(201).json({
      message: 'User registered successfully',
      data: newUser,
    });
  } catch (error: any) {
    if (error.message === 'Email already in use') {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const tokens = await loginUser(req.body);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Login successful',
      data: {
        accessToken: tokens.accessToken,
      },
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const refreshController = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Unauthorized: No refresh token' });
    }

    const newAccessToken = await refreshAccessToken(refreshToken);

    res.status(200).json({
      message: 'Access token refreshed',
      data: { accessToken: newAccessToken },
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const logoutController = async (req: Request, res: Response) => {
  try {
    const userPayload = req.user as JwtPayload;
    await logoutUser(userPayload.id);

    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logout successful' });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getProfileController = async (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Profile fetched successfully',
    data: req.user,
  });
};

export const healthCheckController = async (req: Request, res: Response) => {
  try {
    await prisma.$connect();
    res.status(200).json({
      message: 'Welcome to E-Commerce API!',
      database_status: 'Connected',
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(503).json({
      message: 'API is running, but could not connect to the database.',
      database_status: 'Disconnected',
    });
  } finally {
    await prisma.$disconnect();
  }
};
