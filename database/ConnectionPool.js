/**
 * Connection pool for all database queries throughout the app. Import this module and call getConnection() to get a free pool connection. All queries are
 * executed using the promise library, so you must either await or .then() your implementations appropriately.  
 */
const mysql2 = require("mysql2/promise");

const pool = mysql2.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_SCHEMA_NAME,
    waitForConnections:true,
    connectionLimit: process.env.DATABASE_POOL_CONNECTION_LIMIT || 10,
    idleTimeout: process.env.DATABASE_POOL_IDLE_TIMEOUT || 60000,
    queueLimit: process.env.DATABASE_POOL_QUEUE_LIMIT || 0,
    enableKeepAlive: process.env.DATABASE_POOL_KEEP_ALIVE === "true" ? true : false
});


module.exports = pool;