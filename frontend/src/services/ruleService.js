import { fetchData, postData, updateData, deleteData } from "../utils/apiUtils";

const API_URL = "http://localhost:5000/api/rules";

const ruleService = {
    getRules: (setData) => fetchData(API_URL, setData),
    addRule: (rule) => postData(API_URL, rule),
    updateRule: (id, rule) => updateData(`${API_URL}/${id}`, rule),
    deleteRule: (id) => deleteData(`${API_URL}/${id}`)
};

export default ruleService;