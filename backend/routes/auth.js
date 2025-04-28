const express = require("express")
const router = express.Router()
const db = require("../config/db")

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, role, address } = req.body

    // Check if user already exists
    const [existingUsers] = await db.query("SELECT * FROM users WHERE email = ?", [email])

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "User already exists with this email" })
    }

    // Insert new user
    const [result] = await db.query(
      "INSERT INTO users (name, email, phone, password, role, address) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, phone, password, role, address],
    )

    // Get the newly created user (without password)
    const [newUser] = await db.query("SELECT id, name, email, phone, role, address FROM users WHERE id = ?", [
      result.insertId,
    ])

    res.status(201).json({
      message: "User registered successfully",
      user: newUser[0],
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error during registration" })
  }
})

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body
    console.log("Login request:", { email, role })

    // Find user by email, password and role
    const [users] = await db.query(
      "SELECT id, name, email, phone, role, address FROM users WHERE email = ? AND password = ? AND role = ?",
      [email, password, role],
    )

    console.log("Users found:", users)

    if (users.length === 0) {
      console.log("No user found with these credentials")
      return res.status(401).json({ message: "Invalid credentials or role" })
    }

    // Update user's login status
    await db.query("UPDATE users SET is_logged_in = TRUE WHERE id = ?", [users[0].id])

    console.log("Login successful for user:", users[0])
    res.json({
      message: "Login successful",
      user: users[0],
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error during login" })
  }
})

// Logout user
router.post("/logout", async (req, res) => {
  try {
    const { userId } = req.body

    // Update user's login status
    await db.query("UPDATE users SET is_logged_in = FALSE WHERE id = ?", [userId])

    res.json({ message: "Logout successful" })
  } catch (error) {
    console.error("Logout error:", error)
    res.status(500).json({ message: "Server error during logout" })
  }
})

module.exports = router
