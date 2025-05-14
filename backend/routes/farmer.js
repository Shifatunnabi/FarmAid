const express = require("express")
const router = express.Router()
const db = require("../config/db")

// Get all available lands for rent
router.get("/lands", async (req, res) => {
  try {
    const [lands] = await db.query(
      `SELECT l.*, u.name as owner_name, u.phone as owner_phone, u.email as owner_email 
       FROM lands l 
       JOIN users u ON l.owner_id = u.id 
       WHERE l.status = 'available'`,
    )

    res.json(lands)
  } catch (error) {
    console.error("Error fetching lands:", error)
    res.status(500).json({ message: "Server error while fetching lands" })
  }
})

// Request to rent a land
router.post("/request-land/:landId", async (req, res) => {
  try {
    const { landId } = req.params
    const { farmerId } = req.body

    // Check if land is available
    const [landCheck] = await db.query('SELECT * FROM lands WHERE id = ? AND status = "available"', [landId])

    if (landCheck.length === 0) {
      return res.status(400).json({ message: "Land is not available for rent" })
    }

    // Update land status to pending and set requested_by
    await db.query('UPDATE lands SET status = "pending", requested_by = ? WHERE id = ?', [farmerId, landId])

    res.json({ message: "Land rental request submitted successfully" })
  } catch (error) {
    console.error("Error requesting land:", error)
    res.status(500).json({ message: "Server error while requesting land" })
  }
})

// Get all available loans
router.get("/loans", async (req, res) => {
  try {
    const [loans] = await db.query(
      `SELECT l.*, u.name as bank_name, u.phone as bank_phone, u.email as bank_email 
       FROM loans l 
       JOIN users u ON l.bank_id = u.id 
       WHERE l.status = 'available'`,
    )

    res.json(loans)
  } catch (error) {
    console.error("Error fetching loans:", error)
    res.status(500).json({ message: "Server error while fetching loans" })
  }
})

// Request a loan
router.post("/request-loan/:loanId", async (req, res) => {
  try {
    const { loanId } = req.params
    const { farmerId } = req.body

    // Check if loan is available
    const [loanCheck] = await db.query('SELECT * FROM loans WHERE id = ? AND status = "available"', [loanId])

    if (loanCheck.length === 0) {
      return res.status(400).json({ message: "Loan is not available" })
    }

    // Update loan status to pending and set requested_by
    await db.query('UPDATE loans SET status = "pending", requested_by = ? WHERE id = ?', [farmerId, loanId])

    res.json({ message: "Loan request submitted successfully" })
  } catch (error) {
    console.error("Error requesting loan:", error)
    res.status(500).json({ message: "Server error while requesting loan" })
  }
})

// Get all available pesticides
router.get("/pesticides", async (req, res) => {
  try {
    const [pesticides] = await db.query(
      `SELECT p.*, u.name as store_name, u.phone as store_phone, u.email as store_email 
       FROM pesticides p 
       JOIN users u ON p.store_id = u.id 
       WHERE p.status = 'available'`,
    )

    res.json(pesticides)
  } catch (error) {
    console.error("Error fetching pesticides:", error)
    res.status(500).json({ message: "Server error while fetching pesticides" })
  }
})

// Request a pesticide installment
router.post("/request-pesticide/:pesticideId", async (req, res) => {
  try {
    const { pesticideId } = req.params
    const { farmerId } = req.body

    // Check if pesticide is available
    const [pesticideCheck] = await db.query('SELECT * FROM pesticides WHERE id = ? AND status = "available"', [
      pesticideId,
    ])

    if (pesticideCheck.length === 0) {
      return res.status(400).json({ message: "Pesticide is not available" })
    }

    // Update pesticide status to pending and set requested_by
    await db.query('UPDATE pesticides SET status = "pending", requested_by = ? WHERE id = ?', [farmerId, pesticideId])

    res.json({ message: "Pesticide installment request submitted successfully" })
  } catch (error) {
    console.error("Error requesting pesticide:", error)
    res.status(500).json({ message: "Server error while requesting pesticide" })
  }
})

// Get all available instruments
router.get("/instruments", async (req, res) => {
  try {
    const [instruments] = await db.query(
      `SELECT i.*, u.name as owner_name, u.phone as owner_phone, u.email as owner_email 
       FROM instruments i 
       JOIN users u ON i.owner_id = u.id 
       WHERE i.status = 'available'`,
    )

    res.json(instruments)
  } catch (error) {
    console.error("Error fetching instruments:", error)
    res.status(500).json({ message: "Server error while fetching instruments" })
  }
})

// Request an instrument
router.post("/request-instrument/:instrumentId", async (req, res) => {
  try {
    const { instrumentId } = req.params
    const { farmerId } = req.body

    // Check if instrument is available
    const [instrumentCheck] = await db.query('SELECT * FROM instruments WHERE id = ? AND status = "available"', [
      instrumentId,
    ])

    if (instrumentCheck.length === 0) {
      return res.status(400).json({ message: "Instrument is not available" })
    }

    // Update instrument status to pending and set requested_by
    await db.query('UPDATE instruments SET status = "pending", requested_by = ? WHERE id = ?', [farmerId, instrumentId])

    res.json({ message: "Instrument rental request submitted successfully" })
  } catch (error) {
    console.error("Error requesting instrument:", error)
    res.status(500).json({ message: "Server error while requesting instrument" })
  }
})

// Get farmer's instrument rentals
router.get("/instrument-rentals/:farmerId", async (req, res) => {
  try {
    const { farmerId } = req.params

    const [rentals] = await db.query(
      `SELECT i.*, u.name as owner_name, u.phone as owner_phone, u.email as owner_email 
       FROM instruments i 
       JOIN users u ON i.owner_id = u.id 
       WHERE i.requested_by = ?`,
      [farmerId],
    )

    res.json(rentals)
  } catch (error) {
    console.error("Error fetching instrument rentals:", error)
    res.status(500).json({ message: "Server error while fetching instrument rentals" })
  }
})

// NEW ENDPOINTS FOR COMPREHENSIVE RENTALS PAGE

// Get farmer's land rentals
router.get("/land-rentals/:farmerId", async (req, res) => {
  try {
    const { farmerId } = req.params

    const [rentals] = await db.query(
      `SELECT l.*, u.name as owner_name, u.phone as owner_phone, u.email as owner_email 
       FROM lands l 
       JOIN users u ON l.owner_id = u.id 
       WHERE l.requested_by = ?`,
      [farmerId],
    )

    res.json(rentals)
  } catch (error) {
    console.error("Error fetching land rentals:", error)
    res.status(500).json({ message: "Server error while fetching land rentals" })
  }
})

// Get farmer's loan rentals
router.get("/loan-rentals/:farmerId", async (req, res) => {
  try {
    const { farmerId } = req.params

    const [loans] = await db.query(
      `SELECT l.*, u.name as bank_name, u.phone as bank_phone, u.email as bank_email 
       FROM loans l 
       JOIN users u ON l.bank_id = u.id 
       WHERE l.requested_by = ?`,
      [farmerId],
    )

    res.json(loans)
  } catch (error) {
    console.error("Error fetching loan rentals:", error)
    res.status(500).json({ message: "Server error while fetching loan rentals" })
  }
})

// Get farmer's pesticide rentals
router.get("/pesticide-rentals/:farmerId", async (req, res) => {
  try {
    const { farmerId } = req.params

    const [pesticides] = await db.query(
      `SELECT p.*, u.name as store_name, u.phone as store_phone, u.email as store_email 
       FROM pesticides p 
       JOIN users u ON p.store_id = u.id 
       WHERE p.requested_by = ?`,
      [farmerId],
    )

    res.json(pesticides)
  } catch (error) {
    console.error("Error fetching pesticide rentals:", error)
    res.status(500).json({ message: "Server error while fetching pesticide rentals" })
  }
})

// Create a shared project
router.post("/shared-project", async (req, res) => {
  try {
    const { creatorId, title, description, location, season } = req.body

    // Insert the shared project
    const [result] = await db.query(
      "INSERT INTO shared_projects (creator_id, title, description, location, season) VALUES (?, ?, ?, ?, ?)",
      [creatorId, title, description, location, season],
    )

    res.status(201).json({
      message: "Shared project created successfully",
      projectId: result.insertId,
    })
  } catch (error) {
    console.error("Error creating shared project:", error)
    res.status(500).json({ message: "Server error while creating shared project" })
  }
})

// Get nearby farmers (simplified - in a real app, you'd use location-based filtering)
router.get("/nearby-farmers/:location", async (req, res) => {
  try {
    const { location } = req.params

    // For simplicity, we're just getting all farmers
    // In a real app, you'd filter by proximity to the given location
    const [farmers] = await db.query(
      `SELECT id, name, email, phone, address 
       FROM users 
       WHERE role = 'farmer'`,
    )

    res.json(farmers)
  } catch (error) {
    console.error("Error fetching nearby farmers:", error)
    res.status(500).json({ message: "Server error while fetching nearby farmers" })
  }
})

// Invite farmers to a shared project
router.post("/invite-to-project", async (req, res) => {
  try {
    const { projectId, invitorId, invitedFarmerIds } = req.body

    // Insert invitations for each invited farmer
    for (const farmerId of invitedFarmerIds) {
      await db.query(
        "INSERT INTO shared_project_invites (project_id, invitor_id, invited_farmer_id) VALUES (?, ?, ?)",
        [projectId, invitorId, farmerId],
      )
    }

    res.json({ message: "Invitations sent successfully" })
  } catch (error) {
    console.error("Error sending invitations:", error)
    res.status(500).json({ message: "Server error while sending invitations" })
  }
})

// Get farmer's projects
router.get("/projects/:farmerId", async (req, res) => {
  try {
    const { farmerId } = req.params

    // Get projects created by the farmer
    const [createdProjects] = await db.query(
      `SELECT sp.*, u.name as creator_name
       FROM shared_projects sp
       JOIN users u ON sp.creator_id = u.id
       WHERE sp.creator_id = ?`,
      [farmerId],
    )

    // Get projects the farmer has joined (accepted invitations)
    const [joinedProjects] = await db.query(
      `SELECT sp.*, u.name as creator_name, spi.id as invitation_id
       FROM shared_projects sp
       JOIN shared_project_invites spi ON sp.id = spi.project_id
       JOIN users u ON sp.creator_id = u.id
       WHERE spi.invited_farmer_id = ? AND spi.status = 'accepted'`,
      [farmerId],
    )

    // Combine both sets of projects
    const allProjects = [...createdProjects, ...joinedProjects]

    res.json(allProjects)
  } catch (error) {
    console.error("Error fetching farmer projects:", error)
    res.status(500).json({ message: "Server error while fetching farmer projects" })
  }
})

// Get project invitations for a farmer
router.get("/project-invitations/:farmerId", async (req, res) => {
  try {
    const { farmerId } = req.params

    const [invitations] = await db.query(
      `SELECT spi.*, sp.title as project_title, sp.description as project_description, 
              u.name as invitor_name, u.email as invitor_email
       FROM shared_project_invites spi
       JOIN shared_projects sp ON spi.project_id = sp.id
       JOIN users u ON spi.invitor_id = u.id
       WHERE spi.invited_farmer_id = ? AND spi.status = 'pending'`,
      [farmerId],
    )

    res.json(invitations)
  } catch (error) {
    console.error("Error fetching project invitations:", error)
    res.status(500).json({ message: "Server error while fetching project invitations" })
  }
})

// Respond to a project invitation
router.post("/respond-to-invitation/:invitationId", async (req, res) => {
  try {
    const { invitationId } = req.params
    const { response } = req.body

    if (response !== "accepted" && response !== "rejected") {
      return res.status(400).json({ message: "Invalid response. Must be 'accepted' or 'rejected'" })
    }

    await db.query("UPDATE shared_project_invites SET status = ? WHERE id = ?", [response, invitationId])

    res.json({ message: `Invitation ${response} successfully` })
  } catch (error) {
    console.error("Error responding to invitation:", error)
    res.status(500).json({ message: "Server error while responding to invitation" })
  }
})

module.exports = router
