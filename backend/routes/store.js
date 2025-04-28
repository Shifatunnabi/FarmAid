const express = require("express")
const router = express.Router()
const db = require("../config/db")

// Post a new pesticide installment plan
router.post("/post-pesticide", async (req, res) => {
  try {
    const { storeId, title, name, price, numberOfInstallments, interestRate, duration } = req.body

    // Insert the pesticide
    const [result] = await db.query(
      "INSERT INTO pesticides (store_id, title, name, price, number_of_installments, interest_rate, duration) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [storeId, title, name, price, numberOfInstallments, interestRate, duration],
    )

    res.status(201).json({
      message: "Pesticide installment plan posted successfully",
      pesticideId: result.insertId,
    })
  } catch (error) {
    console.error("Error posting pesticide:", error)
    res.status(500).json({ message: "Server error while posting pesticide" })
  }
})

// Get store's pesticides
router.get("/pesticides/:storeId", async (req, res) => {
  try {
    const { storeId } = req.params

    const [pesticides] = await db.query("SELECT * FROM pesticides WHERE store_id = ?", [storeId])

    res.json(pesticides)
  } catch (error) {
    console.error("Error fetching pesticides:", error)
    res.status(500).json({ message: "Server error while fetching pesticides" })
  }
})

// Get store's sold pesticides
router.get("/sold-pesticides/:storeId", async (req, res) => {
  try {
    const { storeId } = req.params

    const [pesticides] = await db.query(
      `SELECT p.*, u.name as buyer_name, u.phone as buyer_phone, u.email as buyer_email 
       FROM pesticides p 
       JOIN users u ON p.requested_by = u.id 
       WHERE p.store_id = ? AND p.status = 'sold'`,
      [storeId],
    )

    res.json(pesticides)
  } catch (error) {
    console.error("Error fetching sold pesticides:", error)
    res.status(500).json({ message: "Server error while fetching sold pesticides" })
  }
})

// Get pesticide requests
router.get("/pesticide-requests/:storeId", async (req, res) => {
  try {
    const { storeId } = req.params

    const [requests] = await db.query(
      `SELECT p.*, u.name as farmer_name, u.phone as farmer_phone, u.email as farmer_email, u.address as farmer_address 
       FROM pesticides p 
       JOIN users u ON p.requested_by = u.id 
       WHERE p.store_id = ? AND p.status = 'pending'`,
      [storeId],
    )

    res.json(requests)
  } catch (error) {
    console.error("Error fetching pesticide requests:", error)
    res.status(500).json({ message: "Server error while fetching pesticide requests" })
  }
})

// Accept a pesticide request
router.post("/accept-pesticide-request/:pesticideId", async (req, res) => {
  try {
    const { pesticideId } = req.params

    // Update pesticide status to sold
    await db.query('UPDATE pesticides SET status = "sold" WHERE id = ?', [pesticideId])

    res.json({ message: "Pesticide request accepted successfully" })
  } catch (error) {
    console.error("Error accepting pesticide request:", error)
    res.status(500).json({ message: "Server error while accepting pesticide request" })
  }
})

// Reject a pesticide request
router.post("/reject-pesticide-request/:pesticideId", async (req, res) => {
  try {
    const { pesticideId } = req.params

    // Update pesticide status to available and clear requested_by
    await db.query('UPDATE pesticides SET status = "available", requested_by = NULL WHERE id = ?', [pesticideId])

    res.json({ message: "Pesticide request rejected successfully" })
  } catch (error) {
    console.error("Error rejecting pesticide request:", error)
    res.status(500).json({ message: "Server error while rejecting pesticide request" })
  }
})

module.exports = router
