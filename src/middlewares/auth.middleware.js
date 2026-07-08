const { verifyAccessToken } = require("../helpers/jwt")
const User = require("../models/user")

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is required."
            })
        }
        const token = authHeader.split(" ")[1]
        
        const decoded = verifyAccessToken(token)
        const user = await User.findByPk(decoded.id)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found."
            });
        }
        if (user.status !== "ACTIVE") {
            return res.status(403).json({
                success: false,
                message: "Account is inactive."
            });
        }

        req.user = {
            id: user.id,
            role: user.role,
            email: user.email,
        }
        next()

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Access token expired."
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid access token."
            });
        }

        next(error);
    }
}

module.exports = authMiddleware