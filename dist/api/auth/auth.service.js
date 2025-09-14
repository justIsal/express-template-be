"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.refreshAccessToken = exports.loginUser = exports.registerUser = void 0;
const prisma_1 = require("../../config/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../../utils/jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerUser = async (userData) => {
    console.log('userData : ', userData);
    console.log('prisma : ', prisma_1.prisma.user);
    const existingUser = await prisma_1.prisma.user.findUnique({
        where: { email: userData.email },
    });
    if (existingUser) {
        throw new Error('Email already in use');
    }
    const hashedPassword = await bcryptjs_1.default.hash(userData.password, 10);
    const newUser = await prisma_1.prisma.user.create({
        data: {
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
        },
    });
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};
exports.registerUser = registerUser;
const loginUser = async (loginData) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { email: loginData.email },
    });
    if (!user) {
        throw new Error('Invalid email or password');
    }
    const isPasswordValid = await bcryptjs_1.default.compare(loginData.password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }
    const tokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, jwt_1.generateAccessToken)(tokenPayload);
    const refreshToken = (0, jwt_1.generateRefreshToken)(tokenPayload);
    await prisma_1.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: refreshToken },
    });
    return { accessToken, refreshToken };
};
exports.loginUser = loginUser;
const refreshAccessToken = async (refreshToken) => {
    try {
        const payload = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await prisma_1.prisma.user.findUnique({ where: { id: payload.id } });
        if (!user || user.refreshToken !== refreshToken) {
            throw new Error('Unauthorized');
        }
        const newAccessToken = (0, jwt_1.generateAccessToken)({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        return newAccessToken;
    }
    catch (error) {
        throw new Error('Unauthorized');
    }
};
exports.refreshAccessToken = refreshAccessToken;
const logoutUser = async (userId) => {
    await prisma_1.prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
    });
    return { message: 'Logout successful' };
};
exports.logoutUser = logoutUser;
