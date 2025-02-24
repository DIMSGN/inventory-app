import axios from "axios";

const API_BASE_URL = "https://inventory-app-om90.onrender.com/api"; // Use the actual backend URL

axios.get(`${API_BASE_URL}/products`)
  .then(response => console.log(response.data))
  .catch(error => console.error("Error:", error));

export const fetchProducts = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
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
        return response.json();
    } catch (error) {
        console.error("Failed to fetch rules:", error);
        throw error;
    }
};