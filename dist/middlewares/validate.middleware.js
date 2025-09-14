"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    }
    catch (error) {
        const errorMessages = error.errors.map((err) => err.message);
        return res.status(400).json({
            status: 'fail',
            message: errorMessages.join(', '),
        });
    }
};
exports.validate = validate;
