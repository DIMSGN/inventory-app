import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

axios.get(`${API_BASE_URL}/products`)
  .then(response => console.log(response.data))
  .catch(error => console.error("Error:", error));

export const fetchProducts = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/products`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch products:", error);
        throw error;
    }
};

export const fetchRules = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/rules`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        } else {
            console.error('Unexpected response format:', response);
        const response = await axios.get(`${API_BASE_URL}/rules`);
        return response.data;
