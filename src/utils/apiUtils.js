import axios from "axios";

/**
 * Utility function to fetch data from the server.
 * @param {string} url - The URL to fetch data from.
 * @param {Function} setData - The function to update the state with the fetched data.
 */
const fetchData = async (url, setData = () => {}) => {
    try {
        const response = await axios.get(url);
        setData(response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        throw error;
    }
};

/**
 * Utility function to post data to the server.
 * @param {string} url - The URL to post data to.
 * @param {Object} data - The data to post.
 */
const postData = async (url, data) => {
    try {
        const response = await axios.post(url, data);
        return response.data;
    } catch (error) {
        console.error(`Error posting data to ${url}:`, error);
        throw error;
    }
};

/**
 * Utility function to update data on the server.
 * @param {string} url - The URL to update data on.
 * @param {Object} data - The data to update.
 */
const updateData = async (url, data) => {
    try {
        const response = await axios.put(url, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating data on ${url}:`, error);
        throw error;
    }
};

/**
 * Utility function to delete data from the server.
 * @param {string} url - The URL to delete data from.
 */
const deleteData = async (url) => {
    try {
        const response = await axios.delete(url);
        return response.data;
    } catch (error) {
        console.error(`Error deleting data from ${url}:`, error);
        throw error;
    }
};

export { fetchData, postData, updateData, deleteData };