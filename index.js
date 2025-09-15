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
// --------------------- SUPPLIER ROUTES ---------------------

// Get all suppliers
app.get("/suppliers", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute("SELECT * FROM suppliers");
    connection.release();
    return res.json(rows);
  } catch (err) {
    console.log("MySQL query error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Add a supplier
app.post("/suppliers", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const q = `
      INSERT INTO suppliers 
      (supplier_name, category, status, contact_person, email, phone, location, rating)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      req.body.supplier_name,
      req.body.category,
      req.body.status,
      req.body.contact_person,
      req.body.email,
      req.body.phone,
      req.body.location,
      req.body.rating ?? 0.0, // default 0.0 if not provided
    ];

    const [result] = await connection.execute(q, values);
    connection.release();
    return res.json({ message: "Supplier added successfully", result });
  } catch (err) {
    console.log("MySQL query error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Update a supplier
app.put("/suppliers/:id", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const supplierId = req.params.id;
    const q = `
      UPDATE suppliers 
      SET supplier_name = ?, category = ?, status = ?, contact_person = ?, email = ?, phone = ?, location = ?, rating = ?
      WHERE supplier_id = ?
    `;
    const values = [
      req.body.supplier_name,
      req.body.category,
      req.body.status,
      req.body.contact_person,
      req.body.email,
      req.body.phone,
      req.body.location,
      req.body.rating ?? 0.0,
    ];

    const [result] = await connection.execute(q, [...values, supplierId]);
    connection.release();
    return res.json({ message: "Supplier updated successfully", result });
  } catch (err) {
    console.log("MySQL query error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Delete a supplier
app.delete("/suppliers/:id", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const supplierId = req.params.id;
    const q = "DELETE FROM suppliers WHERE supplier_id = ?";

    const [result] = await connection.execute(q, [supplierId]);
    connection.release();
    return res.json({ message: "Supplier deleted successfully", result });
  } catch (err) {
    console.log("MySQL query error:", err);
    return res.status(500).json({ error: err.message });
  }
});
// --------------------- EMPLOYEE ROUTES ---------------------
// Get all employeess
app.get("/employees", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute("SELECT * FROM employees");
    connection.release();
    return res.json(rows);
  } catch (err) {
    console.log("MySQL query error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Add a employee
app.post("/employees", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const q = `
      INSERT INTO employees 
      (name, role,department, email, phone, joining_date, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      req.body.name,
      req.body.role,
      req.body.department,
      req.body.email,
      req.body.phone,
      req.body.joining_date,
      req.body.is_active,
      
    ];

    const [result] = await connection.execute(q, values);
    connection.release();
    return res.json({ message: "Employee added successfully", result });
  } catch (err) {
    console.log("MySQL query error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Update a employee
app.put("/employees/:id", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const employeeId = req.params.id;
    const q = `
      UPDATE employees 
      SET name = ?, role = ?, department=?, email = ?, phone = ?, joining_date=?,  is_active=?
      WHERE employee_id = ?
    `;
    const values = [
        req.body.name,
      req.body.role,
      req.body.department,
      req.body.email,
      req.body.phone,
      req.body.joining_date,
      req.body.is_active,
      
      
    ];

    const [result] = await connection.execute(q, [...values, employeeId]);
    connection.release();
    return res.json({ message: "Employee updated successfully", result });
  } catch (err) {
    console.log("MySQL query error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Delete a employee
app.delete("/employees/:id", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const employeeId = req.params.id;
    const q = "DELETE FROM employees WHERE employee_id = ?";

    const [result] = await connection.execute(q, [employeeId]);
    connection.release();
    return res.json({ message: "employee deleted successfully", result });
  } catch (err) {
    console.log("MySQL query error:", err);
    return res.status(500).json({ error: err.message });
  }
});


// --------------------- WORKFLOW ROUTES ---------------------

// Get all workflows with steps
app.get("/workflows", async (req, res) => {
  try {
    const connection = await pool.getConnection();

    // Fetch workflows
    const [workflows] = await connection.execute("SELECT * FROM workflows");

    // Fetch all steps
    const [steps] = await connection.execute("SELECT * FROM workflow_steps");

    // Attach steps to corresponding workflow
    const workflowsWithSteps = workflows.map((wf) => ({
      ...wf,
      steps: steps
        .filter((step) => step.workflow_id === wf.workflow_id)
        .sort((a, b) => a.step_order - b.step_order),
    }));

    connection.release();
    return res.json(workflowsWithSteps);
  } catch (err) {
    console.error("MySQL query error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Get a single workflow by ID (with steps)
app.get("/workflows/:id", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const workflowId = req.params.id;

    const [workflows] = await connection.execute(
      "SELECT * FROM workflows WHERE workflow_id = ?",
      [workflowId]
    );

    if (workflows.length === 0) {
      connection.release();
      return res.status(404).json({ message: "Workflow not found" });
    }

    const [steps] = await connection.execute(
      "SELECT * FROM workflow_steps WHERE workflow_id = ? ORDER BY step_order",
      [workflowId]
    );

    connection.release();

    return res.json({ ...workflows[0], steps });
  } catch (err) {
    console.error("MySQL query error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Add a workflow (with optional steps)
app.post("/workflows", async (req, res) => {
  const { title, description, status, steps } = req.body;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Insert main workflow
    const [result] = await connection.execute(
      `INSERT INTO workflows (title, description, status)
       VALUES (?, ?, ?)`,
      [title, description, status]
    );

    const workflowId = result.insertId;

    // Insert steps if provided
    if (Array.isArray(steps) && steps.length > 0) {
      const stepValues = steps.map((step, index) => [
        workflowId,
        index + 1,
        step,
      ]);

      await connection.query(
        `INSERT INTO workflow_steps (workflow_id, step_order, step_name)
         VALUES ?`,
        [stepValues]
      );
    }

    await connection.commit();
    connection.release();

    return res.json({ message: "Workflow created successfully", workflowId });
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error("MySQL query error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Update a workflow (and replace steps)
app.put("/workflows/:id", async (req, res) => {
  const workflowId = req.params.id;
  const { title, description, status, steps } = req.body;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Update workflow details
    await connection.execute(
      `UPDATE workflows
       SET title = ?, description = ?, status = ?
       WHERE workflow_id = ?`,
      [title, description, status, workflowId]
    );

    // Delete old steps
    await connection.execute(
      "DELETE FROM workflow_steps WHERE workflow_id = ?",
      [workflowId]
    );

    // Insert new steps (if provided)
    if (Array.isArray(steps) && steps.length > 0) {
      const stepValues = steps.map((step, index) => [
        workflowId,
        index + 1,
        step,
      ]);

      await connection.query(
        `INSERT INTO workflow_steps (workflow_id, step_order, step_name)
         VALUES ?`,
        [stepValues]
      );
    }

    await connection.commit();
    connection.release();

    return res.json({ message: "Workflow updated successfully" });
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error("MySQL query error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Delete a workflow (steps will be deleted via ON DELETE CASCADE)
app.delete("/workflows/:id", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const workflowId = req.params.id;

    const [result] = await connection.execute(
      "DELETE FROM workflows WHERE workflow_id = ?",
      [workflowId]
    );

    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    return res.json({ message: "Workflow deleted successfully" });
  } catch (err) {
    console.error("MySQL query error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// --------------------- SCHEDULE ROUTES ---------------------
app.get("/schedules", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute("SELECT * FROM schedules ORDER BY time ASC");
    connection.release();
    return res.json(rows);
  } catch (err) {
    console.log("MySQL query error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.post("/schedules", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const q = `
      INSERT INTO schedules (title, time, color)
      VALUES (?, ?, ?)
    `;
    const values = [
      req.body.title,
      req.body.time || req.body.event_time, // ✅ Fix here
      req.body.color,
    ];
    const [result] = await connection.execute(q, values);
    connection.release();
    return res.json({ message: "Event added successfully", result });
  } catch (err) {
    console.log("MySQL query error:", err);
    return res.status(500).json({ error: err.message });
  }
});


app.put("/schedules/:id", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const scheduleId = req.params.id;
    const q = `
      UPDATE schedules
      SET title = ?, time = ?, color = ?
      WHERE schedule_id = ?
    `;
    const values = [
      req.body.title,
      req.body.time || req.body.event_time, // ✅ Fix here too
      req.body.color,
    ];
    const [result] = await connection.execute(q, [...values, scheduleId]);
    connection.release();
    return res.json({ message: "Event updated successfully", result });
  } catch (err) {
    console.log("MySQL query error:", err);
    return res.status(500).json({ error: err.message });
  }
});


app.delete("/schedules/:id", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const scheduleId = req.params.id;
    const q = "DELETE FROM schedules WHERE schedule_id = ?";
    const [result] = await connection.execute(q, [scheduleId]);
    connection.release();
    return res.json({ message: "Event deleted successfully", result });
  } catch (err) {
    console.log("MySQL query error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// --------------------- CLIENT MEETINGS ---------------------
app.get("/client-meetings", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute("SELECT * FROM client_meetings ORDER BY date, time");
    connection.release();
    return res.json(rows);
  } catch (err) {
    console.error("MySQL query error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.post("/client-meetings", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { client, purpose, date, time, status, notes } = req.body;
    const q = `
      INSERT INTO client_meetings (client, purpose, date, time, status, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [client, purpose, date, time, status, notes || null];
    const [result] = await connection.execute(q, values);
    connection.release();
    return res.json({ message: "Meeting added successfully", result });
  } catch (err) {
    console.error("MySQL query error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.put("/client-meetings/:id", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const meetingId = req.params.id;
    const { client, purpose, date, time, status, notes } = req.body;
    const q = `
      UPDATE client_meetings
      SET client = ?, purpose = ?, date = ?, time = ?, status = ?, notes = ?
      WHERE meeting_id = ?
    `;
    const values = [client, purpose, date, time, status, notes || null, meetingId];
    const [result] = await connection.execute(q, values);
    connection.release();
    return res.json({ message: "Meeting updated successfully", result });
  } catch (err) {
    console.error("MySQL query error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.delete("/client-meetings/:id", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const meetingId = req.params.id;
    const [result] = await connection.execute(
      "DELETE FROM client_meetings WHERE meeting_id = ?",
      [meetingId]
    );
    connection.release();
    return res.json({ message: "Meeting deleted successfully", result });
  } catch (err) {
    console.error("MySQL query error:", err);
    return res.status(500).json({ error: err.message });
  }
});


// --------------------- RAW MATERIALS ROUTES ---------------------

app.get("/rawmaterials", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute("SELECT * FROM raw_materials");
    connection.release();
    return res.json(rows);
  } catch (err) {
    console.log("MySQL query error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Add a raw material
// Add material
app.post("/rawmaterials", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const q = `
      INSERT INTO raw_materials 
      (name, category, quantity, supplier, cost, status, last_updated)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      req.body.name,
      req.body.category,
      req.body.quantity,
      req.body.supplier,
      req.body.cost,
      req.body.status,
      new Date().toISOString().slice(0, 19).replace("T", " "),
    ];
    const [result] = await connection.execute(q, values);
    connection.release();
    res.json({ message: "Material added successfully", result });
  } catch (err) {
    console.log("MySQL query error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update material
app.put("/rawmaterials/:id", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const materialId = req.params.id;
    const q = `
      UPDATE raw_materials
      SET name=?, category=?, quantity=?, supplier=?, cost=?, status=?, last_updated=?
      WHERE material_id=?
    `;
    const values = [
      req.body.name,
      req.body.category,
      req.body.quantity,
      req.body.supplier,
      req.body.cost,
      req.body.status,
      new Date().toISOString().slice(0, 19).replace("T", " "),
      materialId,
    ];
    const [result] = await connection.execute(q, values);
    connection.release();
    res.json({ message: "Material updated successfully", result });
  } catch (err) {
    console.log("MySQL query error:", err);
    res.status(500).json({ error: err.message });
  }
});


// Delete a raw material
app.delete("/rawmaterials/:id", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const materialId = req.params.id;
    const q = "DELETE FROM raw_materials WHERE material_id=?";
    const [result] = await connection.execute(q, [materialId]);
    connection.release();
    return res.json({ message: "Material deleted successfully", result });
  } catch (err) {
    console.log("MySQL query error:", err);
    return res.status(500).json({ error: err.message });
  }
});


// Get all products
app.get("/products", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute("SELECT * FROM products ORDER BY created_at DESC");
    connection.release();
    res.json(rows);
  } catch (err) {
    console.log("MySQL query error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Add a product
app.post("/products", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const q = `
      INSERT INTO products (sku, name, category, price, stock, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const sku = `SKU-${Date.now()}`;
    const values = [sku, req.body.name, req.body.category, req.body.price, req.body.stock, req.body.status];
    const [result] = await connection.execute(q, values);
    connection.release();
    res.json({ message: "Product added successfully", result });
  } catch (err) {
    console.log("MySQL query error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update a product
app.put("/products/:id", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const q = `
      UPDATE products 
      SET name=?, category=?, price=?, stock=?, status=? 
      WHERE product_id=?
    `;
    const values = [req.body.name, req.body.category, req.body.price, req.body.stock, req.body.status, req.params.id];
    const [result] = await connection.execute(q, values);
    connection.release();
    res.json({ message: "Product updated successfully", result });
  } catch (err) {
    console.log("MySQL query error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a product
app.delete("/products/:id", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const q = "DELETE FROM products WHERE product_id=?";
    const [result] = await connection.execute(q, [req.params.id]);
    connection.release();
    res.json({ message: "Product deleted successfully", result });
  } catch (err) {
    console.log("MySQL query error:", err);
    res.status(500).json({ error: err.message });
  }
});
















































































app.listen(5000, () => {
  console.log("Server running on port 5000");
});
