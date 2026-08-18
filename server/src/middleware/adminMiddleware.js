const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.role !== "admin") {
            return res.status(403).json({
                message: "Admin access required"
            });
        }

        next();

    } catch (error) {
        res.status(500).json({
            message: "Authorization failed",
            error: error.message
        });
    }
};

module.exports = adminMiddleware;