import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL + "/categories";

const categoryService = {
    getCategories: () => {
        return axios.get(API_URL);
    },
    addCategory: (category) => {
        return axios.post(API_URL, { category });
    },
    deleteCategoryById: (id) => {
        return axios.delete(`${API_URL}/id/${id}`);
    },
    deleteCategoryByName: (name) => {
        return axios.delete(`${API_URL}/name/${name}`);
    },
};

export default categoryService; 