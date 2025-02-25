const pool = require('../db/connection');

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