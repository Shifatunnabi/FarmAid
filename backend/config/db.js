const mysql = require("mysql2")
require("dotenv").config()

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Convert pool to use promises
const promisePool = pool.promise()

// Test connection
promisePool
  .query("SELECT 1")
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection error:", err))

module.exports = promisePool
