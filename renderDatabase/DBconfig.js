const { Pool } = require('pg');
const itemsPool = new Pool({
    connectionString: "postgres://root:CINcQlRLpVbqKHC86K2vZJAWkUsar2JL@dpg-cpg3bp6ct0pc73d67h20-a.singapore-postgres.render.com/inventory_89sx",
    ssl: {
        rejectUnauthorized: false
    }
});
module.exports = itemsPool;
