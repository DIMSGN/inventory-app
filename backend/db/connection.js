require('dotenv').config();
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10, // Adjust the connection limit as needed
    host: process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB,
    port: process.env.MYSQL_ADDON_PORT,
    ssl: { rejectUnauthorized: false },
});

module.exports = pool;
