const express = require("express")
const router = express.Router()
const db = require("../config/db")

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params

    const [users] = await db.query("SELECT id, name, email, phone, role, address FROM users WHERE id = ?", [id])

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(users[0])
  } catch (error) {
    console.error("Error fetching user:", error)
    res.status(500).json({ message: "Server error while fetching user" })
  }
})

module.exports = router
