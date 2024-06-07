const itemsPool = require('./renderDatabase/DBconfig.js');

const mysqlConfig = {
    host: 'localhost',
    user: 'root',
    password: '9060',
    database: 'inventory'
  };

const transferData = async () => {
    let mysqlConnection;

    // Connect to MySQL
    mysqlConnection = await mysql.createConnection(mysqlConfig);
    console.log('Connected to MySQL');

    // Read data from MySQL
    const [rows, fields] = await mysqlConnection.execute('SELECT * FROM updatelog');
    console.log('Data fetched from MySQL');

    await itemsPool.query('IF OBJECT_ID(\'updatelog\', \'U\') IS NOT NULL DROP TABLE updatelog;');
    console.log('Existing table dropped (if any)');

    const createTableQuery = `CREATE TABLE updatelog (${fields.map(field => `${field.name} ${mapMySQLTypeToSQLServerType(field.type)}`).join(', ')});`;
    await itemsPool.query(createTableQuery);
    console.log('Table created in SQL Server');

    rows.forEach(async row => {
        const columnNames = fields.map(field => field.name).join(', ');
        const values = fields.map(field => row[field.name]);
        const namedParameters = fields.map(field => `@${field.name}`).join(', ');
        const insertQuery = `INSERT INTO updatelog (${columnNames}) VALUES (${namedParameters});`;
    
        const request = itemsPool.request();
        fields.forEach((field, index) => {
            request.input(field.name, values[index]);
        });
    
        await request.query(insertQuery);
    });
  
      console.log('Data inserted into SQL Server');
  
      // Select data from SQL Server
      const result = await itemsPool.query('SELECT * FROM updatelog');
      console.log('Data fetched from SQL Server:', result.recordset);
}

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

module.export = transferData;