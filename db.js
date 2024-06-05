const sql = require('mssql');
const mysql = require('mysql');

// Function to create a MSSQL connection
const connectDB = async () => {
    try {
        // Create connection pool
        const pool = await mysql.createConnection({
            user: 'root',
            password: '9060',
            host: 'localhost',
            database: 'inventory',
            options: {
                encrypt: true, // Use encryption
                trustServerCertificate: true // Trust the server certificate
            }
        });

        console.log('Connected to MSSQL database');
        return pool;
    } catch (error) {
        console.error('Error connecting to MSSQL database:', error);
        throw error;
    }
};

// Export the function to establish the connection
module.exports = connectDB;
