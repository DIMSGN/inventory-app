const pool = require('../db/connection');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const queryDatabase = (query, params = []) => {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

module.exports = queryDatabase;