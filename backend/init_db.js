const { initializeDatabase } = require("./config/db_init")

// Run the initialization
initializeDatabase()
  .then(() => {
    console.log("Database initialization completed")
    process.exit(0)
  })
  .catch((err) => {
    console.error("Database initialization failed:", err)
    process.exit(1)
  })
