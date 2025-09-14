import { prisma } from '../../config/prisma';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import jwt from 'jsonwebtoken';

export const registerUser = async (userData: any) => {
  console.log('userData : ', userData);
  console.log('prisma : ', prisma.user);
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });
  if (existingUser) {
    throw new Error('Email already in use');
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const newUser = await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    },
  });

  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const loginUser = async (loginData: any) => {
  const user = await prisma.user.findUnique({
    where: { email: loginData.email },
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(loginData.password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const tokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: refreshToken },
  });

  return { accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as jwt.JwtPayload;

    const user = await prisma.user.findUnique({ where: { id: payload.id } });

    if (!user || user.refreshToken !== refreshToken) {
      throw new Error('Unauthorized');
    }

    const newAccessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return newAccessToken;
  } catch (error) {
    throw new Error('Unauthorized');
  }
};

export const logoutUser = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
  return { message: 'Logout successful' };
};

export const findAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true, 
    },
  });
  return users;
};
