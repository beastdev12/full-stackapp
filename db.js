// db.js
const mysql = require('mysql');

// Function to create a MySQL connection
const connectDB = () => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '9060',
        database: 'inventory'
    });

    return connection;
};

// Export the function to establish the connection
module.exports = connectDB;
