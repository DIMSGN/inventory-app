const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  connectionLimit: 10, 
  host: process.env.MYSQL_ADDON_HOST,
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB,
  port: process.env.MYSQL_ADDON_PORT,
  ssl: { rejectUnauthorized: false }, 
});

const queryDatabase = (query, params = []) => {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (error, results) => {
      if (error) {
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
          console.error('Database connection was closed.');
        } else if (error.code === 'ER_CON_COUNT_ERROR') {
          console.error('Database has too many connections.');
        } else if (error.code === 'ECONNREFUSED') {
          console.error('Database connection was refused.');
        }
        return reject(error);
      }
      resolve(results);
    });
  });
};

module.exports = queryDatabase;