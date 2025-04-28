const db = require("./db")

async function initializeDatabase() {
  try {
    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        phone VARCHAR(20) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('farmer', 'landowner', 'bank', 'pesticide_store', 'instrument_owner') NOT NULL,
        address TEXT NOT NULL,
        is_logged_in BOOLEAN DEFAULT FALSE,
        PRIMARY KEY (id)
      )
    `)
    console.log("Users table created or already exists")

    // Create lands table
    await db.query(`
      CREATE TABLE IF NOT EXISTS lands (
        id INT PRIMARY KEY AUTO_INCREMENT,
        owner_id INT,
        title VARCHAR(100),
        location VARCHAR(255),
        size VARCHAR(100),
        interest_rate FLOAT,
        requested_by INT DEFAULT NULL,
        status ENUM('available', 'pending', 'rented') DEFAULT 'available',
        FOREIGN KEY (owner_id) REFERENCES users(id),
        FOREIGN KEY (requested_by) REFERENCES users(id)
      )
    `)
    console.log("Lands table created or already exists")

    // Create loans table
    await db.query(`
      CREATE TABLE IF NOT EXISTS loans (
        id INT PRIMARY KEY AUTO_INCREMENT,
        bank_id INT,
        title VARCHAR(100),
        amount DECIMAL(10, 2),
        interest_rate FLOAT,
        duration VARCHAR(100),
        requested_by INT DEFAULT NULL,
        status ENUM('available', 'pending', 'booked') DEFAULT 'available',
        FOREIGN KEY (bank_id) REFERENCES users(id),
        FOREIGN KEY (requested_by) REFERENCES users(id)
      )
    `)
    console.log("Loans table created or already exists")

    // Create pesticides table
    await db.query(`
      CREATE TABLE IF NOT EXISTS pesticides (
        id INT PRIMARY KEY AUTO_INCREMENT,
        store_id INT,
        title VARCHAR(100),
        name VARCHAR(100),
        price INT,
        number_of_installments INT,
        interest_rate FLOAT,
        duration VARCHAR(100),
        requested_by INT DEFAULT NULL,
        status ENUM('available', 'pending', 'sold') DEFAULT 'available',
        FOREIGN KEY (store_id) REFERENCES users(id),
        FOREIGN KEY (requested_by) REFERENCES users(id)
      )
    `)
    console.log("Pesticides table created or already exists")

    // Create instruments table
    await db.query(`
      CREATE TABLE IF NOT EXISTS instruments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        owner_id INT,
        title VARCHAR(100),
        name VARCHAR(100),
        rent_price DECIMAL(10, 2),
        duration VARCHAR(100),
        requested_by INT DEFAULT NULL,
        status ENUM('available', 'pending', 'rented') DEFAULT 'available',
        FOREIGN KEY (owner_id) REFERENCES users(id),
        FOREIGN KEY (requested_by) REFERENCES users(id)
      )
    `)
    console.log("Instruments table created or already exists")

    // Create shared_projects table
    await db.query(`
      CREATE TABLE IF NOT EXISTS shared_projects (
        id INT PRIMARY KEY AUTO_INCREMENT,
        creator_id INT,
        title VARCHAR(255),
        description TEXT,
        location VARCHAR(255),
        season VARCHAR(55),
        status ENUM('pending', 'started', 'completed') DEFAULT 'pending',
        FOREIGN KEY (creator_id) REFERENCES users(id)
      )
    `)
    console.log("Shared projects table created or already exists")

    // Create shared_project_invites table
    await db.query(`
      CREATE TABLE IF NOT EXISTS shared_project_invites (
        id INT PRIMARY KEY AUTO_INCREMENT,
        project_id INT,
        invitor_id INT,
        invited_farmer_id INT,
        status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
        FOREIGN KEY (project_id) REFERENCES shared_projects(id),
        FOREIGN KEY (invitor_id) REFERENCES users(id),
        FOREIGN KEY (invited_farmer_id) REFERENCES users(id)
      )
    `)
    console.log("Shared project invites table created or already exists")

    console.log("All tables created successfully")
  } catch (error) {
    console.error("Error initializing database:", error)
  }
}

// Run the initialization
// initializeDatabase()  // Comment this line out

module.exports = { initializeDatabase }
