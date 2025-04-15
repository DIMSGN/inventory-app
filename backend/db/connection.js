require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit: 10, // Adjust the connection limit as needed
    host: process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB,
    port: process.env.MYSQL_ADDON_PORT,
    ssl: { rejectUnauthorized: false },
    waitForConnections: true,
    queueLimit: 0, // Unlimited queueing
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000 // 10 seconds
});

// Test connection on startup
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        } else if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        } else if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.');
        }
    } else {
        console.log('Connected to the database successfully');
        connection.release(); // Release the connection back to the pool
    }
});

module.exports = pool;
