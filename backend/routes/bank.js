const express = require("express")
const router = express.Router()
const db = require("../config/db")

// Post a new loan
router.post("/post-loan", async (req, res) => {
  try {
    const { bankId, title, amount, interestRate, duration } = req.body

    // Insert the loan
    const [result] = await db.query(
      "INSERT INTO loans (bank_id, title, amount, interest_rate, duration) VALUES (?, ?, ?, ?, ?)",
      [bankId, title, amount, interestRate, duration],
    )

    res.status(201).json({
      message: "Loan posted successfully",
      loanId: result.insertId,
    })
  } catch (error) {
    console.error("Error posting loan:", error)
    res.status(500).json({ message: "Server error while posting loan" })
  }
})

// Get bank's loans
router.get("/loans/:bankId", async (req, res) => {
  try {
    const { bankId } = req.params

    const [loans] = await db.query("SELECT * FROM loans WHERE bank_id = ?", [bankId])

    res.json(loans)
  } catch (error) {
    console.error("Error fetching loans:", error)
    res.status(500).json({ message: "Server error while fetching loans" })
  }
})

// Get bank's approved loans
router.get("/approved-loans/:bankId", async (req, res) => {
  try {
    const { bankId } = req.params

    const [loans] = await db.query(
      `SELECT l.*, u.name as borrower_name, u.phone as borrower_phone, u.email as borrower_email 
       FROM loans l 
       JOIN users u ON l.requested_by = u.id 
       WHERE l.bank_id = ? AND l.status = 'booked'`,
      [bankId],
    )

    res.json(loans)
  } catch (error) {
    console.error("Error fetching approved loans:", error)
    res.status(500).json({ message: "Server error while fetching approved loans" })
  }
})

// Get loan requests
router.get("/loan-requests/:bankId", async (req, res) => {
  try {
    const { bankId } = req.params

    const [requests] = await db.query(
      `SELECT l.*, u.name as farmer_name, u.phone as farmer_phone, u.email as farmer_email, u.address as farmer_address 
       FROM loans l 
       JOIN users u ON l.requested_by = u.id 
       WHERE l.bank_id = ? AND l.status = 'pending'`,
      [bankId],
    )

    res.json(requests)
  } catch (error) {
    console.error("Error fetching loan requests:", error)
    res.status(500).json({ message: "Server error while fetching loan requests" })
  }
})

// Accept a loan request
router.post("/accept-loan-request/:loanId", async (req, res) => {
  try {
    const { loanId } = req.params

    // Update loan status to booked
    await db.query('UPDATE loans SET status = "booked" WHERE id = ?', [loanId])

    res.json({ message: "Loan request accepted successfully" })
  } catch (error) {
    console.error("Error accepting loan request:", error)
    res.status(500).json({ message: "Server error while accepting loan request" })
  }
})

// Reject a loan request
router.post("/reject-loan-request/:loanId", async (req, res) => {
  try {
    const { loanId } = req.params

    // Update loan status to available and clear requested_by
    await db.query('UPDATE loans SET status = "available", requested_by = NULL WHERE id = ?', [loanId])

    res.json({ message: "Loan request rejected successfully" })
  } catch (error) {
    console.error("Error rejecting loan request:", error)
    res.status(500).json({ message: "Server error while rejecting loan request" })
  }
})

module.exports = router
