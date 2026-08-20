import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticate = (req, res, next) => {
    const authorization = req.headers.authorization;
    const [scheme, token] = authorization?.split(' ') || [];

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({
            success: false,
            message: 'Authorization token is required'
        });
    }

    if (!process.env.JWT_SECRET) {
        return next(new Error('JWT_SECRET is not configured'));
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        const message = error.name === 'TokenExpiredError'
            ? 'Authorization token has expired'
            : 'Invalid authorization token';

        return res.status(401).json({ success: false, message });
    }
};

export const authorize = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: 'You do not have permission to access this resource'
        });
    }

    next();
};