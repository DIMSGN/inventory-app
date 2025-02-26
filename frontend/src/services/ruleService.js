import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL + "/rules";

const ruleService = {
    getRules: () => {
        return axios.get(API_URL);
    },
    addRule: (rule) => {
        return axios.post(API_URL, rule);
    },
    updateRule: (id, rule) => {
        return axios.put(`${API_URL}/${id}`, rule);
    },
    deleteRule: (id) => {
        return axios.delete(`${API_URL}/${id}`);
    },
};

export default ruleService;