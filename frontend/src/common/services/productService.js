import { API_URL } from '../config';
import apiClient from './api';

const PRODUCTS_URL = "/products";

const productService = {
    getProducts: () => {
        return apiClient.get(PRODUCTS_URL);
    },
    getProductById: (id) => {
        return apiClient.get(`${PRODUCTS_URL}/${id}`);
    },
    addProduct: (product) => {
        return apiClient.post(PRODUCTS_URL, product);
    },
    updateProduct: (id, product) => {
        return apiClient.put(`${PRODUCTS_URL}/${id}`, product);
    },
    deleteProduct: (id) => {
        return apiClient.delete(`${PRODUCTS_URL}/${id}`);
    },
};

export default productService; 