import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;
console.log("API_BASE_URL:", API_BASE_URL); // Add this line to log the base URL

export const fetchData = async (url) => {
    try {
        const response = await axios.get(`${API_BASE_URL}${url}`);
        if (response.headers['content-type'].includes('application/json')) {
            console.log("API Response Data:", response.data);
            return response.data;
        } else {
            console.error('Unexpected response format:', response);
            throw new Error('Unexpected response format');
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

export const updateData = async (url, data) => {
    try {
        const response = await axios.put(`${API_BASE_URL}${url}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating data:", error);
        throw error;
    }
};

export const deleteData = async (url) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}${url}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting data:", error);
        throw error;
    }
};