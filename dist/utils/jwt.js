"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const generateAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, ACCESS_SECRET, { expiresIn: '15m' }); // Kedaluwarsa dalam 15 menit
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, REFRESH_SECRET, { expiresIn: '7d' }); // Kedaluwarsa dalam 7 hari
};
exports.generateRefreshToken = generateRefreshToken;
const verifyToken = (token, secret) => {
    try {
        const secretKey = secret === 'access' ? ACCESS_SECRET : REFRESH_SECRET;
        return jsonwebtoken_1.default.verify(token, secretKey);
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
