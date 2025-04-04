import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL + "/categories";

const addCategory = async (categoryName) => {
    return axios.post(API_URL, { category: categoryName });
};

const deleteCategory = async (categoryName) => {
    return axios.delete(`${API_URL}/${encodeURIComponent(categoryName)}`); // Send name as URL param
};

export default { addCategory, deleteCategory };