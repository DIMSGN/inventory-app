import { API_URL } from '../config';
import apiClient from './api';

const CATEGORIES_URL = "/categories";

const categoryService = {
    getCategories: () => {
        return apiClient.get(CATEGORIES_URL);
    },
    addCategory: (category) => {
        return apiClient.post(CATEGORIES_URL, { category });
    },
    deleteCategoryById: (id) => {
        return apiClient.delete(`${CATEGORIES_URL}/id/${id}`);
    },
    deleteCategoryByName: (name) => {
        return apiClient.delete(`${CATEGORIES_URL}/name/${name}`);
    },
};

export default categoryService; 