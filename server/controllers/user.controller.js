import User from "../models/user.model.js"


/**
 * @desc    Get currently authenticated user details
 * @route   GET /api/user/current-user
 * @access  Private (Requires protect middleware)
 */
export const getCurrentUser = async (req, res) => {
    try {
        // Find by ID using the ID parsed from the middleware token verification
        const user = req.user;

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                credits: user.credits
            }
        });
    } catch (error) {
        console.error("Get Current User Error:", error);
        return res.status(500).json({ success: false, message: "Server error." });
    }
};