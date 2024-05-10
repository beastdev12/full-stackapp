// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./db'); // Import the database connection function

const app = express();

// Middleware
app.use(cors());


// Route to fetch data from the database
app.get('/api/data', (req, res) => {
    // Establish connection to the database
    const connection = connectDB();

    // Example query to fetch data
    connection.query('SELECT * FROM products', (error, results) => {
        if (error) {
            console.error('Error executing query: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(200).json(results);
            console.log("Recieved and Success Get Request");
        }

        // Don't forget to end the connection after querying
        connection.end();
    });
});



app.post('/api/data', (req, res) => {
    // Get the query from the request body
    const query = req.query.data;
  
    // Ensure query is present before attempting to execute it
    if (!query) {
      return res.status(400).json({ error: 'Missing query in request body' });
    }
  
    // Establish connection to the database
    const connection = connectDB();
  
    // Example query to fetch data
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json(results);
        console.log("Recieved and Success POST Request");
    }
    
    // Don't forget to end the connection after querying
    connection.end();
    });
  });

  
app.post('/api/auth', (req, res) => {
    // Get the query from the request body
    const query = req.query.data;
  
    // Ensure query is present before attempting to execute it
    
    if (!query) {
      return res.status(400).json({ error: 'Missing query in request body' });
    }
  
    // Establish connection to the database
    const connection = connectDB();
  
    // Example query to fetch data
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error executing query: ', error);
        //res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log(results);
        res.status(200).json(results);
        console.log("Recieved and Success POST Request");
    }
    
    // Don't forget to end the connection after querying
    connection.end();
    });
  });
  
app.post('/api/userSession', (req, res) => {
    // Get the query from the request body
    const query = req.query.data;
  
    // Ensure query is present before attempting to execute it
    
    if (!query) {
      return res.status(400).json({ error: 'Missing query in request body' });
    }
  
    // Establish connection to the database
    const connection = connectDB();
  
    // Example query to fetch data
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error executing query: ', error);
        //res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log(results);
        res.status(200).json(results);
        console.log("Recieved and Success POST Request");
    }
    
    // Don't forget to end the connection after querying
    connection.end();
    });
  });
  

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
