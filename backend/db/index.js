const pool = require('./connection');

/**
 * Get a client from the connection pool for transaction operations
 * @returns {Promise<object>} A client object with query method for executing SQL
 */
const getClient = async () => {
  const connection = await pool.promise().getConnection();
  
  // Create a client proxy that wraps the connection
  return {
    release: () => connection.release(),
    query: async (text, params = []) => {
      // Handle transaction commands directly
      if (text === 'BEGIN') {
        await connection.beginTransaction();
        return { rows: [] };
      } else if (text === 'COMMIT') {
        await connection.commit();
        return { rows: [] };
      } else if (text === 'ROLLBACK') {
        await connection.rollback();
        return { rows: [] };
      }
      
      // Execute regular queries
      const [rows] = await connection.query(text, params);
      return { rows };
    }
  };
};

module.exports = {
  query: async (text, params = []) => {
    try {
      const [rows] = await pool.promise().query(text, params);
      return { rows };
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  },
  getClient
}; 