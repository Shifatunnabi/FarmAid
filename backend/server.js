const express = require("express")
const cors = require("cors")
const db = require("./config/db")

// Import routes
const authRoutes = require("./routes/auth")
const farmerRoutes = require("./routes/farmer")
const landownerRoutes = require("./routes/landowner")
const bankRoutes = require("./routes/bank")
const storeRoutes = require("./routes/store")
const instrumentRoutes = require("./routes/instrument")

const app = express()

// Configure CORS - Use more permissive settings during development
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "*"], // Add your frontend URLs
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

app.use(express.json())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/farmer", farmerRoutes)
app.use("/api/landowner", landownerRoutes)
app.use("/api/bank", bankRoutes)
app.use("/api/store", storeRoutes)
app.use("/api/instrument", instrumentRoutes)

// Test route
app.get("/", (req, res) => {
  res.send("Farm Aid API is running")
})

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err)
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
