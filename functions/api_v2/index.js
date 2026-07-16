const express = require('express');
const catalyst = require('zcatalyst-sdk-node');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET || 'sentinai-secret-key-12345';

// Simulated Zoho Catalyst Advanced I/O function for Natural Language to ZCQL
app.post('/api/copilot/query', async (req, res) => {
  try {
    const { prompt } = req.body;
    let query = "";
    if (prompt.toLowerCase().includes("heinous")) {
      query = "SELECT * FROM CaseMaster INNER JOIN GravityOffence ON CaseMaster.GravityOffenceID = GravityOffence.GravityOffenceID WHERE GravityOffence.LookupValue = 'Heinous'";
    } else {
      query = "SELECT * FROM CaseMaster LIMIT 10";
    }

    res.status(200).json({
      success: true,
      message: "Data retrieved successfully via Catalyst Serverless",
      zcql: query,
      data: []
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Authentication endpoints using Zoho Catalyst Data Store
app.post('/auth/register', async (req, res) => {
  try {
    const { username, password, name, role, division } = req.body;
    
    // Initialize Catalyst App
    const catalystApp = catalyst.initialize(req);
    
    // Check if user exists
    const zcql = catalystApp.zcql();
    const existingUser = await zcql.executeZCQLQuery(`SELECT * FROM Users WHERE username = '${username}'`);
    
    if (existingUser && existingUser.length > 0) {
      return res.status(400).json({ success: false, error: "Username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert into Catalyst Data Store
    const datastore = catalystApp.datastore();
    const table = datastore.table('Users');
    
    const insertPromise = table.insertRow({
      username: username,
      password: hashedPassword,
      name: name,
      role: role || 'Investigator',
      division: division || 'General',
      approval_status: 'pending'
    });

    const row = await insertPromise;

    res.status(201).json({ success: true, message: "User registered successfully", user: { username, name, role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Initialize Catalyst App
    const catalystApp = catalyst.initialize(req);
    const zcql = catalystApp.zcql();
    
    // Fetch user
    const users = await zcql.executeZCQLQuery(`SELECT * FROM Users WHERE username = '${username}'`);
    
    if (!users || users.length === 0) {
      return res.status(401).json({ success: false, error: "Invalid username or password" });
    }

    // The result from ZCQL comes in the format [{ Users: { username: '...', password: '...', ... } }]
    const userRow = users[0].Users;

    // Verify password
    const isMatch = await bcrypt.compare(password, userRow.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid username or password" });
    }

    // Check approval status
    if (userRow.approval_status === 'pending') {
      return res.status(403).json({ success: false, error: "Account creation is pending admin approval." });
    } else if (userRow.approval_status === 'rejected') {
      return res.status(403).json({ success: false, error: "Account request was rejected." });
    }

    // Create JWT
    const payload = {
      id: userRow.ROWID,
      username: userRow.username,
      name: userRow.name,
      role: userRow.role,
      division: userRow.division
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ 
      success: true, 
      token, 
      user: payload 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- User Approval Endpoints ---
app.get('/auth/pending', async (req, res) => {
  try {
    const catalystApp = catalyst.initialize(req);
    const zcql = catalystApp.zcql();
    const users = await zcql.executeZCQLQuery(`SELECT * FROM Users WHERE approval_status = 'pending'`);
    
    const formattedUsers = users.map(u => ({
      id: u.Users.ROWID,
      username: u.Users.username,
      name: u.Users.name,
      role: u.Users.role,
      division: u.Users.division,
      approval_status: u.Users.approval_status
    }));
    
    res.status(200).json({ success: true, data: formattedUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/auth/approve/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const catalystApp = catalyst.initialize(req);
    const datastore = catalystApp.datastore();
    const table = datastore.table('Users');
    
    await table.updateRow({
      ROWID: id,
      approval_status: 'approved'
    });
    
    res.status(200).json({ success: true, message: "User approved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/auth/reject/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const catalystApp = catalyst.initialize(req);
    const datastore = catalystApp.datastore();
    const table = datastore.table('Users');
    
    await table.deleteRow(id);
    
    res.status(200).json({ success: true, message: "User rejected and removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Reports Endpoints ---

app.get('/api/reports', async (req, res) => {
  try {
    const catalystApp = catalyst.initialize(req);
    const zcql = catalystApp.zcql();
    const reports = await zcql.executeZCQLQuery(`SELECT * FROM Reports`);
    
    // ZCQL returns [{ Reports: { reportId: ..., title: ... } }]
    const formattedReports = reports.map(r => r.Reports).map(report => ({
      id: report.reportId || report.ROWID,
      title: report.title,
      category: report.category,
      status: report.status,
      priority: report.reportPriority,
      date: report.reportDate,
      reporter: report.reportedBy,
      assigned: report.assignedTo
    }));
    
    res.status(200).json({ success: true, data: formattedReports });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/reports', async (req, res) => {
  try {
    const { reportId, title, category, status, priority, reportDate, reporter, assigned } = req.body;
    const catalystApp = catalyst.initialize(req);
    const datastore = catalystApp.datastore();
    const table = datastore.table('Reports');
    
    const rowData = {
      reportId, title, category, status, reportPriority: priority, reportDate, reportedBy: reporter, assignedTo: assigned
    };
    
    const insertPromise = table.insertRow(rowData);
    const row = await insertPromise;
    
    res.status(201).json({ success: true, data: { id: row.ROWID, ...rowData } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/reports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const catalystApp = catalyst.initialize(req);
    const datastore = catalystApp.datastore();
    const table = datastore.table('Reports');
    
    const updatePromise = table.updateRow({
      ROWID: id,
      status: status
    });
    
    const row = await updatePromise;
    res.status(200).json({ success: true, data: row });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/reports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const catalystApp = catalyst.initialize(req);
    const datastore = catalystApp.datastore();
    const table = datastore.table('Reports');
    
    const deletePromise = table.deleteRow(id);
    await deletePromise;
    
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Seed Endpoint ---
app.post('/api/seed-all', async (req, res) => {
  try {
    const catalystApp = catalyst.initialize(req);
    const datastore = catalystApp.datastore();
    
    // Require the mock schema JSON
    const mockData = require('./mockSchema.json');
    
    // We will insert data into the corresponding tables.
    // The keys in mockData match the table names exactly.
    const tables = Object.keys(mockData);
    
    for (let tableName of tables) {
      const tableRef = datastore.table(tableName);
      const rows = mockData[tableName];
      
      for (let row of rows) {
        await tableRef.insertRow(row);
      }
    }

    // Seed Reports as well
    const reportsTable = datastore.table('Reports');
    const fallbackReports = [
      { reportId: 'REP-2026-894', title: 'Cyber Fraud at MG Road', category: 'Cyber Crime', reportDate: '2026-05-18T14:30:00Z', reportPriority: 'High', status: 'In Progress', reportedBy: 'Ramesh Singh', assignedTo: 'Insp. Vikram' },
      { reportId: 'REP-2026-893', title: 'Vehicle Theft - Honda City', category: 'Theft', reportDate: '2026-05-18T09:15:00Z', reportPriority: 'Medium', status: 'Pending', reportedBy: 'Anita Kumar', assignedTo: 'Sub Insp. Sharma' },
      { reportId: 'REP-2026-892', title: 'Domestic Violence Complaint', category: 'Assault', reportDate: '2026-05-17T22:45:00Z', reportPriority: 'Critical', status: 'Resolved', reportedBy: 'Anonymous', assignedTo: 'Insp. Meena' }
    ];
    for (let row of fallbackReports) {
      await reportsTable.insertRow(row);
    }

    res.status(201).json({ success: true, message: "Full database seeded successfully" });
  } catch (err) {
    console.error("Seed error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Dashboard Data Fetch Endpoint ---
app.get('/api/dashboard-data', async (req, res) => {
  try {
    const catalystApp = catalyst.initialize(req);
    const zcql = catalystApp.zcql();
    
    // We need to fetch data from all 11 tables and return it in the format expected by the frontend.
    // The frontend expects an object with keys matching the table names.
    const tables = [
      "GravityOffence", "CaseCategory", "CrimeHead", "Unit", "CaseMaster", 
      "Accused", "Victim", "ArrestSurrender", "PredictiveForecasts", 
      "Anomalies", "SocioEconomicFactors"
    ];
    
    let combinedData = {};
    
    for (let tableName of tables) {
      try {
        const result = await zcql.executeZCQLQuery(`SELECT * FROM ${tableName}`);
        // Result is in format [{ TableName: { col: val, col: val } }]
        let formattedRows = result.map(row => row[tableName]);
        
        // Handle column renames required by Catalyst reserved keywords
        if (tableName === 'PredictiveForecasts') {
          formattedRows = formattedRows.map(r => ({ ...r, month: r.forecastMonth }));
        }
        if (tableName === 'Anomalies') {
          formattedRows = formattedRows.map(r => ({ ...r, date: r.anomalyDate, id: r.anomalyId }));
        }
        
        combinedData[tableName] = formattedRows;
      } catch (err) {
        console.warn(`Could not fetch table ${tableName}:`, err.message);
        combinedData[tableName] = []; // Fallback to empty array if table isn't ready
      }
    }
    
    res.status(200).json({ success: true, data: combinedData });
  } catch (err) {
    console.error("Dashboard Data Fetch error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = app;
