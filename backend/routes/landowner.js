const express = require("express")
const router = express.Router()
const db = require("../config/db")

// Post a new land for rent
router.post("/post-land", async (req, res) => {
  try {
    const { ownerId, title, location, size, interestRate } = req.body

    // Insert the land
    const [result] = await db.query(
      "INSERT INTO lands (owner_id, title, location, size, interest_rate) VALUES (?, ?, ?, ?, ?)",
      [ownerId, title, location, size, interestRate],
    )

    res.status(201).json({
      message: "Land posted successfully",
      landId: result.insertId,
    })
  } catch (error) {
    console.error("Error posting land:", error)
    res.status(500).json({ message: "Server error while posting land" })
  }
})

// Get landowner's lands
router.get("/lands/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params

    const [lands] = await db.query("SELECT * FROM lands WHERE owner_id = ?", [ownerId])

    res.json(lands)
  } catch (error) {
    console.error("Error fetching lands:", error)
    res.status(500).json({ message: "Server error while fetching lands" })
  }
})

// Get landowner's rented lands
router.get("/rented-lands/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params

    const [lands] = await db.query(
      `SELECT l.*, u.name as renter_name, u.phone as renter_phone, u.email as renter_email 
       FROM lands l 
       JOIN users u ON l.requested_by = u.id 
       WHERE l.owner_id = ? AND l.status = 'rented'`,
      [ownerId],
    )

    res.json(lands)
  } catch (error) {
    console.error("Error fetching rented lands:", error)
    res.status(500).json({ message: "Server error while fetching rented lands" })
  }
})

// Get land rental requests
router.get("/land-requests/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params

    const [requests] = await db.query(
      `SELECT l.*, u.name as farmer_name, u.phone as farmer_phone, u.email as farmer_email, u.address as farmer_address 
       FROM lands l 
       JOIN users u ON l.requested_by = u.id 
       WHERE l.owner_id = ? AND l.status = 'pending'`,
      [ownerId],
    )

    res.json(requests)
  } catch (error) {
    console.error("Error fetching land requests:", error)
    res.status(500).json({ message: "Server error while fetching land requests" })
  }
})

// Accept a land rental request
router.post("/accept-land-request/:landId", async (req, res) => {
  try {
    const { landId } = req.params

    // Update land status to rented
    await db.query('UPDATE lands SET status = "rented" WHERE id = ?', [landId])

    res.json({ message: "Land rental request accepted successfully" })
  } catch (error) {
    console.error("Error accepting land request:", error)
    res.status(500).json({ message: "Server error while accepting land request" })
  }
})

// Reject a land rental request
router.post("/reject-land-request/:landId", async (req, res) => {
  try {
    const { landId } = req.params

    // Update land status to available and clear requested_by
    await db.query('UPDATE lands SET status = "available", requested_by = NULL WHERE id = ?', [landId])

    res.json({ message: "Land rental request rejected successfully" })
  } catch (error) {
    console.error("Error rejecting land request:", error)
    res.status(500).json({ message: "Server error while rejecting land request" })
  }
})

module.exports = router
