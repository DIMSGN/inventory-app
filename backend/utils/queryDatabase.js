const pool = require('../db/connection');

/**
 * Execute a database query with parameters and improved error handling
 * @param {string} query - SQL query to execute
 * @param {Array} params - Parameters for the query
 * @returns {Promise} - Resolves with query results
 */
const queryDatabase = (query, params = []) => {
    return new Promise((resolve, reject) => {
        // Safety check for database connection
        if (!pool) {
            console.error('Database connection pool is not initialized');
            return reject(new Error('Database connection not available'));
        }

        // Get connection from pool with timeout
        const connectionPromise = new Promise((resolveConn, rejectConn) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    console.error('Error acquiring database connection:', err);
                    return rejectConn(err);
                }
                resolveConn(connection);
            });
            
            // Add connection timeout
            setTimeout(() => {
                rejectConn(new Error('Timeout waiting for database connection'));
            }, 15000);
        });

        // Handle the connection
        connectionPromise
            .then(connection => {
                // Only log queries in development mode or if debugging is enabled
                const isDebugMode = process.env.NODE_ENV !== 'production' || process.env.DEBUG_SQL === 'true';
                
                if (isDebugMode) {
                    const truncatedQuery = query.length > 200 ? `${query.substring(0, 200)}...` : query;
                    console.log(`📝 Executing query: ${truncatedQuery}`);
                    
                    if (params.length > 0) {
                        // Safely log parameters (hide sensitive data)
                        const safeParams = params.map(p => 
                            typeof p === 'string' && p.length > 50 ? `${p.substring(0, 50)}...` : p
                        );
                        console.log(`🔹 With parameters: ${JSON.stringify(safeParams)}`);
                    }
                }

                // Execute the query with a timeout
                const queryTimeout = setTimeout(() => {
                    console.error(`Query execution timeout: ${query.substring(0, 100)}...`);
                    connection.release();
                    reject(new Error('Query execution timeout'));
                }, 30000);

                connection.query(query, params, (error, results) => {
                    clearTimeout(queryTimeout);
                    connection.release();

                    if (error) {
                        console.error(`Database query error: ${error.message}`);
                        return reject(error);
                    }
                    
                    // For transaction statements, just return success
                    if (query.match(/^(START TRANSACTION|COMMIT|ROLLBACK)$/i)) {
                        return resolve({ success: true });
                    }
                    
                    // Log completion only in debug mode
                    if (isDebugMode && Array.isArray(results)) {
                        console.log(`Query returned ${results.length} rows`);
                    }
                    
                    resolve(results);
                });
            })
            .catch(err => {
                console.error('Failed to get database connection:', err);
                reject(err);
            });
    });
};

module.exports = queryDatabase;