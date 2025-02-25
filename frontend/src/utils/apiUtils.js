import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

/**
 * Utility function to fetch data from the server.
 * @param {string} url - The URL to fetch data from.
 * @param {Function} setData - The function to update the state with the fetched data.
 */
export const fetchData = async (url) => {
    try {
        const response = await axios.get(url);
        console.log("API Response Data:", response.data); // Log the response data
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

/**
 * Utility function to post data to the server.
 * @param {string} url - The URL to post data to.
 * @param {Object} data - The data to post.
 */
export const postData = async (url, data) => {
    try {
        const response = await axios.post(url, data);
        return response.data;
    } catch (error) {
        console.error("Error posting data:", error);
        throw error;
    }
};

/**
 * Utility function to update data on the server.
 * @param {string} url - The URL to update data on.
 * @param {Object} data - The data to update.
 */
export const updateData = async (url, data) => {
    try {
        const response = await axios.put(url, data);
        return response.data;
    } catch (error) {
        console.error("Error updating data:", error);
        throw error;
    }
};

/**
 * Utility function to delete data from the server.
 * @param {string} url - The URL to delete data from.
 */
export const deleteData = async (url) => {
    try {
        const response = await axios.delete(url);
        return response.data;
    } catch (error) {
        console.error("Error deleting data:", error);
        throw error;
    }
};