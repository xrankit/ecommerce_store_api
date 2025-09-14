import User from "../model/user.js";
import { sign } from "jsonwebtoken";
import bcrypt from "bcrypt"; // for password hashing

// Login Controller
export async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT
    const token = sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || "secret_key", // get from .env
      { expiresIn: "1h" } // token expires in 1 hour
    );

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
