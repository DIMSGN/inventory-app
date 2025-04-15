const pool = require('../db/connection');

/**
 * Execute a database query with parameters
 * @param {string} query - SQL query to execute
 * @param {Array} params - Parameters for the query
 * @returns {Promise} - Resolves with query results
 */
const queryDatabase = (query, params = []) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Error acquiring database connection:', err);
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    console.error('Database connection was closed.');
                } else if (err.code === 'ER_CON_COUNT_ERROR') {
                    console.error('Database has too many connections.');
                } else if (err.code === 'ECONNREFUSED') {
                    console.error('Database connection was refused.');
                }
                return reject(err);
            }

            // Log the query for debugging (in development)
            if (process.env.NODE_ENV !== 'production') {
                console.log(`Executing query: ${query}`);
                if (params.length > 0) {
                    console.log(`With parameters: ${JSON.stringify(params)}`);
                }
            }

            connection.query(query, params, (error, results) => {
                // Always release the connection back to the pool
                connection.release(); 

                if (error) {
                    console.error(`Database query error for query: ${query}`, error);
                    return reject(error);
                }
                
                // For transaction statements, just return success
                if (query.match(/^(START TRANSACTION|COMMIT|ROLLBACK)$/i)) {
                    return resolve({ success: true });
                }
                
                resolve(results);
            });
        });
    });
};

module.exports = queryDatabase;