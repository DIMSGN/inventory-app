const pool = require('../db/connection');

const queryDatabase = (query, params = []) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    console.error('Database connection was closed.');
                } else if (err.code === 'ER_CON_COUNT_ERROR') {
                    console.error('Database has too many connections.');
                } else if (err.code === 'ECONNREFUSED') {
                    console.error('Database connection was refused.');
                }
                return reject(err);
            }

            connection.query(query, params, (error, results) => {
                connection.release(); // Release the connection back to the pool

                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    });
};

module.exports = queryDatabase;