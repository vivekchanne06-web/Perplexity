import jwt from "jsonwebtoken";
import redis from '../config/cache.js';

export async function authUser(req, res, next) {

    try {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "No token provided"
        });
    }

    const isBlacklisted = await redis.get(token);

    if (isBlacklisted) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "Token has been blacklisted"
        });
    }


        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
        
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "Invalid token"
        });
    }
}