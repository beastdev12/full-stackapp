const itemsPool = require('./DBconfig');
const mysql = require('mysql2/promise');

const mysqlConfig = {
    host: 'localhost',
    user: 'root',
    password: '9060',
    database: 'inventory'
};

async function transferData() {
    let mysqlConnection;

    let tableName = 'location'

    // Connect to MySQL
    mysqlConnection = await mysql.createConnection(mysqlConfig);
    console.log('Connected to MySQL');

    // Read data from MySQL
    const [rows, fields] = await mysqlConnection.execute(`SELECT * FROM ${tableName}`);
    console.log('Data fetched from MySQL');

    // Drop table if exists in PostgreSQL
    await itemsPool.query(`DROP TABLE IF EXISTS ${tableName};`);
    console.log('Existing table dropped (if any)');

    // Create table in PostgreSQL
    const createTableQuery = `CREATE TABLE ${tableName} (${fields.map(field => `${field.name} ${mapMySQLTypeToSQLServerType(field.type)}`).join(', ')});`;
    await itemsPool.query(createTableQuery);
    console.log('Table created in PostgreSQL');

    // Insert data into PostgreSQL
    for (const row of rows) {
        const columnNames = Object.keys(row).join(', ');
        const values = Object.values(row);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
        const insertQuery = `INSERT INTO ${tableName} (${columnNames}) VALUES (${placeholders});`;
        await itemsPool.query(insertQuery, values);
    }

    console.log('Data inserted into PostgreSQL');

    // Select data from PostgreSQL
    const result = await itemsPool.query(`SELECT * FROM ${tableName}`);
    console.log('Data fetched from PostgreSQL:', result.rows);
}

function mapMySQLTypeToSQLServerType(mysqlType) {
    switch (mysqlType) {
        case 1: // MySQL INT
            return 'INT';
        case 253: // MySQL VARCHAR
            return 'VARCHAR';
        // Add cases for other MySQL data types as needed
        default:
            return 'VARCHAR'; // Default to VARCHAR
    }
}

transferData();
