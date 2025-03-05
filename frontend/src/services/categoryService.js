import axios from "axios";

const addCategory = async (category) => {
    const response = await axios.post("/api/categories", { category });
    return response.data;
};

export default {
    addCategory,
};