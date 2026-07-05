import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

/**
 * @desc    Middleware to authenticate and protect routes
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next middleware function
 */

export const verifyToken = async (req, res, next) => {
  console.log("--> Request hit verifyToken middleware!");
  try {
    // 1. Extract token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided.",
      });
    }

    // 2. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);
    // 3. Find the user associated with the token and attach to request
    // .select("-password") ensures we don't carry the hashed password around in memory unnecessarily
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Authentication failed. User no longer exists.",
      });
    }

    // 4. Attach user payload to the request object
    req.user = user;

    // 5. Pass control to the next controller function
    next();
  } catch (error) {
    console.error("Authentication Middleware Error:", error);

    // Catch specific JWT errors for clearer client feedback
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token structure." });
    }

    return res.status(401).json({
      success: false,
      message: "Not authorized, token verification failed.",
    });
  }
};
