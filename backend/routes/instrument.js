const express = require("express")
const router = express.Router()
const db = require("../config/db")

// Post a new instrument for rent
router.post("/post-instrument", async (req, res) => {
  try {
    const { ownerId, title, name, rentPrice, duration } = req.body

    // Insert the instrument
    const [result] = await db.query(
      "INSERT INTO instruments (owner_id, title, name, rent_price, duration) VALUES (?, ?, ?, ?, ?)",
      [ownerId, title, name, rentPrice, duration],
    )

    res.status(201).json({
      message: "Instrument posted successfully",
      instrumentId: result.insertId,
    })
  } catch (error) {
    console.error("Error posting instrument:", error)
    res.status(500).json({ message: "Server error while posting instrument" })
  }
})

// Get owner's instruments
router.get("/instruments/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params

    const [instruments] = await db.query("SELECT * FROM instruments WHERE owner_id = ?", [ownerId])

    res.json(instruments)
  } catch (error) {
    console.error("Error fetching instruments:", error)
    res.status(500).json({ message: "Server error while fetching instruments" })
  }
})

// Get owner's rented instruments
router.get("/rented-instruments/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params

    const [instruments] = await db.query(
      `SELECT i.*, u.name as renter_name, u.phone as renter_phone, u.email as renter_email 
       FROM instruments i 
       JOIN users u ON i.requested_by = u.id 
       WHERE i.owner_id = ? AND i.status = 'rented'`,
      [ownerId],
    )

    res.json(instruments)
  } catch (error) {
    console.error("Error fetching rented instruments:", error)
    res.status(500).json({ message: "Server error while fetching rented instruments" })
  }
})

// Get instrument rental requests
router.get("/instrument-requests/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params

    const [requests] = await db.query(
      `SELECT i.*, u.name as farmer_name, u.phone as farmer_phone, u.email as farmer_email, u.address as farmer_address 
       FROM instruments i 
       JOIN users u ON i.requested_by = u.id 
       WHERE i.owner_id = ? AND i.status = 'pending'`,
      [ownerId],
    )

    res.json(requests)
  } catch (error) {
    console.error("Error fetching instrument requests:", error)
    res.status(500).json({ message: "Server error while fetching instrument requests" })
  }
})

// Accept an instrument rental request
router.post("/accept-instrument-request/:instrumentId", async (req, res) => {
  try {
    const { instrumentId } = req.params

    // Update instrument status to rented
    await db.query('UPDATE instruments SET status = "rented" WHERE id = ?', [instrumentId])

    res.json({ message: "Instrument rental request accepted successfully" })
  } catch (error) {
    console.error("Error accepting instrument request:", error)
    res.status(500).json({ message: "Server error while accepting instrument request" })
  }
})

// Reject an instrument rental request
router.post("/reject-instrument-request/:instrumentId", async (req, res) => {
  try {
    const { instrumentId } = req.params

    // Update instrument status to available and clear requested_by
    await db.query('UPDATE instruments SET status = "available", requested_by = NULL WHERE id = ?', [instrumentId])

    res.json({ message: "Instrument rental request rejected successfully" })
  } catch (error) {
    console.error("Error rejecting instrument request:", error)
    res.status(500).json({ message: "Server error while rejecting instrument request" })
  }
})

module.exports = router
