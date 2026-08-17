import { findUserByUsername } from "../models/userModel.js";

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required."
            });
        }

        const user = await findUserByUsername(username);

        if (!user) {
            return res.status(401).json({
                message: "Invalid username or password."
            });
        }

        if (!user.is_active) {
            return res.status(403).json({
                message: "This account is inactive."
            });
        }

        // Temporary password check
        if (password !== user.password_hash) {
            return res.status(401).json({
                message: "Invalid username or password."
            });
        }

        res.json({
            message: "Login successful.",
            user: {
                user_id: user.user_id,
                employee_id: user.employee_id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Server error during login."
        });
    }
};

export { login };