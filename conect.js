const mysql = require('mysql2/promise');
const sql = require('mssql');

// MySQL connection configuration
const mysqlConfig = {
  host: 'localhost',
  user: 'root',
  password: '9060',
  database: 'inventory'
};

// SQL Server connection configuration
const sqlServerConfig = {
  user: 'Devesh',
  password: 'Rajput@2005',
  server: 'mssql-173221-0.cloudclusters.net',
  port: 10062,
  database: 'inventory',
  options: {
    encrypt: true, // Use encryption
    trustServerCertificate: true, // Trust the server certificate
  }
};

async function transferData() {
    let mysqlConnection;
    let sqlServerPool;
  
    try {
      // Connect to MySQL
      mysqlConnection = await mysql.createConnection(mysqlConfig);
      console.log('Connected to MySQL');
  
      // Read data from MySQL
      const [rows, fields] = await mysqlConnection.execute('SELECT * FROM updatelog');
      console.log('Data fetched from MySQL');
  
      // Connect to SQL Server
      sqlServerPool = await sql.connect(sqlServerConfig);
      console.log('Connected to SQL Server');
  
      // Wait for the connection pool to be fully open
      await sqlServerPool.connect();
  
      // Drop the existing 'updatelog' table if it already exists
      await sqlServerPool.query('IF OBJECT_ID(\'updatelog\', \'U\') IS NOT NULL DROP TABLE updatelog;');
      console.log('Existing table dropped (if any)');
  
      // Generate SQL query to create table
      const createTableQuery = `CREATE TABLE updatelog (${fields.map(field => `${field.name} ${mapMySQLTypeToSQLServerType(field.type)}`).join(', ')});`;
      await sqlServerPool.query(createTableQuery);
      console.log('Table created in SQL Server');
  
      // Insert data into SQL Server
      rows.forEach(async row => {
        const columnNames = fields.map(field => field.name).join(', ');
        const values = fields.map(field => row[field.name]);
        const namedParameters = fields.map(field => `@${field.name}`).join(', ');
        const insertQuery = `INSERT INTO updatelog (${columnNames}) VALUES (${namedParameters});`;
    
        const request = sqlServerPool.request();
        fields.forEach((field, index) => {
            request.input(field.name, values[index]);
        });
    
        await request.query(insertQuery);
    });
  
      console.log('Data inserted into SQL Server');
  
      // Select data from SQL Server
      const result = await sqlServerPool.query('SELECT * FROM updatelog');
      console.log('Data fetched from SQL Server:', result.recordset);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      if (mysqlConnection) {
        await mysqlConnection.end();
      }
      if (sqlServerPool) {
        await sqlServerPool.close();
      }
    }
  }
  
  
  
  // Function to map MySQL data types to SQL Server data types
  function mapMySQLTypeToSQLServerType(mysqlType) {
    switch (mysqlType) {
      case 1: // MySQL INT
        return 'INT';
      case 253: // MySQL VARCHAR
        return 'NVARCHAR(MAX)';
      // Add cases for other MySQL data types as needed
      default:
        return 'NVARCHAR(MAX)'; // Default to NVARCHAR(MAX)
    }
  }
  
  transferData();
  