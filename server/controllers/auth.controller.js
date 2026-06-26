import generateToken from "../config/token.js"; // Added missing .js extension if using ES Modules
import User from "../models/user.model.js";

/**
 * @desc    Authenticate user via Google (Sign In / Sign Up)
 * @route   POST /api/auth/google
 * @access  Public
 */
export const googleAuth = async (req, res) => {
  try {
    const { name, email } = req.body;

    // 1. Input Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required fields.",
      });
    }

    // 2. Find or Create User
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ name, email });
    }

    // 3. Token Generation
    const token = await generateToken(user._id);


    res.cookie("token", token, {
      http: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 5. Consistent Response Payload (Excluding password/sensitive fields if any)
    return res.status(200).json({
      success: true,
      message: "Authentication successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        credits:user.credits
      },
    });
  } catch (error) {
    // Log the actual error internally for debugging
    console.error("Google Auth Error:", error);

    // Return a generic, safe error message to the client
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred during authentication.",
    });
  }
};

/**
 * @desc    Log user out / clear authentication cookie
 * @route   POST /api/auth/logout
 * @access  Private (or Public, depending on your auth middleware setup)
 */
export const logout = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    // 1. Clear the authentication cookie
    res.clearCookie("token", {
      http: true,
      secure: false,
      sameSite: strict,
    });

    // 2. Return a standardized success response
    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Logout Error:", error);

    return res.status(500).json({
      success: false,
      message: "An internal server error occurred during logout.",
    });
  }
};


