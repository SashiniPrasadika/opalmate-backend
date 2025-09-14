import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Create connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "password",
  database: "opalmate", // Updated DB name
});

// Test the connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database: opalmate');
    connection.release();
  } catch (err) {
    console.error('Error connecting to MySQL:', err);
  }
}

// Run connection test
testConnection();

app.get("/", (req, res) => {
  res.json("API is running");
});
// --------------------- CUSTOMER ROUTES ---------------------

app.get("/customers", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute("SELECT * FROM customers");
    connection.release();
    return res.json(rows);
  } catch (err) {
    console.log("MySQL query error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.post("/customers", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const q = `
      INSERT INTO customers (name, email, phone, location, orders, rating)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      req.body.name,
      req.body.email,
      req.body.phone,
      req.body.location,
      req.body.orders ?? 0, // default 0 if not provided
      req.body.rating ?? 0.0, // default 0.0 if not provided
    ];

    const [result] = await connection.execute(q, values);
    connection.release();

    console.log("Customer added:", result);
    return res.json({ message: "Customer added successfully", result });
  } catch (err) {
    console.log("MySQL query error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.put("/customers/:id", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const customerId = req.params.id;
    const q = `
      UPDATE customers 
      SET name = ?, email = ?, phone = ?, location = ?, orders = ?, rating = ?
      WHERE customer_id = ?
    `;
    const values = [
      req.body.name,
      req.body.email,
      req.body.phone,
      req.body.location,
      req.body.orders ?? 0,
      req.body.rating ?? 0.0,
    ];

    const [result] = await connection.execute(q, [...values, customerId]);
    connection.release();
    return res.json({ message: "Customer updated successfully", result });
  } catch (err) {
    console.log("MySQL query error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.delete("/customers/:id", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const customerId = req.params.id;
    const q = "DELETE FROM customers WHERE customer_id = ?";

    const [result] = await connection.execute(q, [customerId]);
    connection.release();
    return res.json({ message: "Customer deleted successfully", result });
  } catch (err) {
    console.log("MySQL query error:", err);
    return res.status(500).json({ error: err.message });
  }
});
// --------------------- supplier ROUTES ---------------------

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
