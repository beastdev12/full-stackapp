const express = require('express');
const cors = require('cors');
const connectDB = require('./db'); // Import the database connection function
const util = require('util');
const connecter = require('./connecter')

const app = express();

const axios = require('axios');

(async () => {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        console.log(response.data.ip);
    } catch (error) {
        console.error('Failed to get public IP address:', error);
    }
})();


// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies



// Function to handle queries
const queryhandler = async (dataQuery) => {
  try {
    // Establish connection to the database
    const connection = await connectDB();
    const query = util.promisify(connection.query).bind(connection);

    // Execute the query and get the results
    const results = await query(dataQuery);

    // Don't forget to release the connection after querying
    await connection.end();
    
    return results; // Return the actual results
  } catch (error) {
    console.error('Error executing query: ', error);
    throw error; // Handle error appropriately
  }
};

// Route to fetch data from the database
app.get('/api/data', async (req, res) => {
  try {
    const result = await queryhandler('SELECT * FROM products');
    res.status(200).json(result);
    console.log("Received and Success GET Request");
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/data', async (req, res) => {
  const query = req.query.data; // Use req.body to get JSON data

  if (!query) {
    return res.status(400).json({ error: 'Missing query in request body' });
  }
  else {
    console.log(query)
  }

  try {
    const result = await queryhandler(query);
    res.status(200).json(result);
    console.log("Received and Success POST Request");
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/auth', async (req, res) => {
  const query = req.query.data; // Use req.body to get JSON data

  if (!query) {
    return res.status(400).json({ error: 'Missing query in request body' });
  }

  try {
    const result = await queryhandler(query);
    console.log(result)
    res.status(200).json(result);
    console.log("Received and Success POST Request");
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/userSession', async (req, res) => {
  const query = req.query.data; // Use req.body to get JSON data

  if (!query) {
    return res.status(400).json({ error: 'Missing query in request body' });
  }

  try {
    const result = await queryhandler(query);
    res.status(200).json(result);
    console.log("Received and Success POST Request");
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
