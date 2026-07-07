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
      division: division || 'General'
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

module.exports = app;
