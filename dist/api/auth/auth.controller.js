"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileController = exports.logoutController = exports.refreshController = exports.loginController = exports.registerController = void 0;
const auth_service_1 = require("./auth.service");
const registerController = async (req, res) => {
    try {
        const newUser = await (0, auth_service_1.registerUser)(req.body);
        res.status(201).json({
            message: 'User registered successfully',
            data: newUser,
        });
    }
    catch (error) {
        if (error.message === 'Email already in use') {
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.registerController = registerController;
const loginController = async (req, res) => {
    try {
        const tokens = await (0, auth_service_1.loginUser)(req.body);
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
    }
    catch (error) {
        res.status(401).json({ message: error.message });
    }
};
exports.loginController = loginController;
const refreshController = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Unauthorized: No refresh token' });
        }
        const newAccessToken = await (0, auth_service_1.refreshAccessToken)(refreshToken);
        res.status(200).json({
            message: 'Access token refreshed',
            data: { accessToken: newAccessToken },
        });
    }
    catch (error) {
        res.status(401).json({ message: error.message });
    }
};
exports.refreshController = refreshController;
const logoutController = async (req, res) => {
    try {
        const userPayload = req.user;
        await (0, auth_service_1.logoutUser)(userPayload.id);
        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'Logout successful' });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.logoutController = logoutController;
const getProfileController = async (req, res) => {
    res.status(200).json({
        message: 'Profile fetched successfully',
        data: req.user,
    });
};
exports.getProfileController = getProfileController;
