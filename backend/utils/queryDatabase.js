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
            }, 15000); // 15 seconds timeout
        });

        // Handle the connection
        connectionPromise
            .then(connection => {
                // Log the query for debugging (in development or with debug flag)
                if (process.env.NODE_ENV !== 'production' || process.env.DEBUG_SQL === 'true') {
                    console.log(`📝 Executing query: ${query.substring(0, 200)}${query.length > 200 ? '...' : ''}`);
                    if (params.length > 0) {
                        // Safely log parameters (hide sensitive data)
                        const safeParams = params.map(p => 
                            typeof p === 'string' && p.length > 50 ? p.substring(0, 50) + '...' : p
                        );
                        console.log(`🔹 With parameters: ${JSON.stringify(safeParams)}`);
                    }
                }

                // Execute the query with a timeout
                const queryTimeout = setTimeout(() => {
                    console.error(`⏱️ Query timeout exceeded: ${query.substring(0, 100)}...`);
                    connection.release();
                    reject(new Error('Query execution timeout'));
                }, 30000); // 30 seconds timeout for query execution

                connection.query(query, params, (error, results) => {
                    // Clear the timeout
                    clearTimeout(queryTimeout);
                    
                    // Always release the connection back to the pool
                    connection.release();

                    if (error) {
                        console.error(`🔴 Database query error for query: ${query.substring(0, 100)}...`, error);
                        
                        // Specific error handling
                        if (error.code === 'ER_LOCK_DEADLOCK') {
                            console.error('Deadlock detected. Transaction will be retried.');
                        } else if (error.code === 'ER_DUP_ENTRY') {
                            console.error('Duplicate entry detected:', error.message);
                        }
                        
                        return reject(error);
                    }
                    
                    // For transaction statements, just return success
                    if (query.match(/^(START TRANSACTION|COMMIT|ROLLBACK)$/i)) {
                        return resolve({ success: true });
                    }
                    
                    // Log query completion if in development mode
                    if (process.env.NODE_ENV !== 'production' || process.env.DEBUG_SQL === 'true') {
                        console.log(`✅ Query completed successfully: ${query.substring(0, 50)}...`);
                        if (Array.isArray(results)) {
                            console.log(`📊 Results: ${results.length} rows returned`);
                        }
                    }
                    
                    resolve(results);
                });
            })
            .catch(err => {
                console.error('❌ Failed to get database connection:', err);
                reject(err);
            });
    });
};

module.exports = queryDatabase;