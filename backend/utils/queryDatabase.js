const pool = require('../db/connection');

/**
 * Execute a database query with parameters and improved error handling
 * @param {string} query - SQL query to execute
 * @param {Array} params - Parameters for the query
 * @param {number} maxRetries - Maximum number of retries before giving up
 * @returns {Promise} - Resolves with query results
 */
const queryDatabase = (query, params = [], maxRetries = 2) => {
    let retryCount = 0;
    
    const executeQuery = () => {
        return new Promise((resolve, reject) => {
            // Safety check for database connection
            if (!pool) {
                console.error('Database connection pool is not initialized');
                return reject(new Error('Database connection not available'));
            }

            // Get connection from pool with timeout
            pool.getConnection((err, connection) => {
                if (err) {
                    console.error('Error acquiring database connection:', err);
                    
                    // Check if we should retry
                    if (retryCount < maxRetries) {
                        retryCount++;
                        const delay = 1000 * Math.pow(2, retryCount);
                        console.log(`Retrying database operation (attempt ${retryCount}) in ${delay/1000} seconds...`);
                        
                        setTimeout(() => {
                            executeQuery().then(resolve).catch(reject);
                        }, delay);
                        return;
                    }
                    
                    return reject(err);
                }
                
                // Successful connection, execute query
                connection.query(query, params, (error, results) => {
                    // Always release the connection back to the pool regardless of error
                    connection.release();
                    
                    if (error) {
                        console.error('Database query error:', error);
                        return reject(error);
                    }
                    
                    resolve(results);
                });
            });
        });
    };
    
    return executeQuery();
};

module.exports = queryDatabase;