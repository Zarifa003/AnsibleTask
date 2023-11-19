const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
// MySQL connection
const connection = mysql.createConnection({
    host: 'host.docker.internal',
    user: 'root', // Replace with your MySQL username
    password: 'root', // Replace with your MySQL password
    database: 'ansibletask' // Replace with your database name
});

connection.connect((error) => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});

// GET request
app.get('/data', (req, res) => {
    connection.query('SELECT * FROM your_table', (error, results) => {
        if (error) throw error;
        res.send(results);
    });
});

// POST request
app.post('/data', (req, res) => {
    let data = { name: req.body.name, value: req.body.value }; // Replace with your data fields
    let sql = 'INSERT INTO your_table SET ?';
    connection.query(sql, data, (error, results) => {
        if (error) throw error;
        res.send('Data added successfully!');
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
