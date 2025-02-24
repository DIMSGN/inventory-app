const API_BASE_URL = "https://inventory-app-om90.onrender.com/api"; 
export const fetchProducts = async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    return response.json();
};

export const fetchRules = async () => {
    const response = await fetch(`${API_BASE_URL}/rules`);
    return response.json();
};