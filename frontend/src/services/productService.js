import axios from "axios";

const API_URL = "https://app-d118d68a-4c2e-42ad-b162-dd8cc2db6692.cleverapps.io/api/products";

const productService = {
    getProducts: () => {
        return axios.get(API_URL);
    },
    addProduct: (product) => {
        return axios.post(API_URL, product);
    },
    updateProduct: (id, product) => {
        return axios.put(`${API_URL}/${id}`, product);
    },
    deleteProduct: (id) => {
        return axios.delete(`${API_URL}/${id}`);
    },
};

export default productService;
