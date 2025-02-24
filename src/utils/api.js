import axios from "axios";

const API_BASE_URL = "https://inventory-app-om90.onrender.com";

axios.get(`${API_BASE_URL}/api/products`)
  .then(response => console.log(response.data))
  .catch(error => console.error("Error:", error));

export const fetchProducts = async () => {
    const response = await fetch(`${API_BASE_URL}/api/products`);
    return response.json();
};

export const fetchRules = async () => {
    const response = await fetch(`${API_BASE_URL}/api/rules`);
    return response.json();
};