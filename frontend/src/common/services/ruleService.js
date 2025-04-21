import { API_URL } from '../config';
import apiClient from './api';

const RULES_URL = "/rules";

const ruleService = {
    getRules: () => {
        return apiClient.get(RULES_URL);
    },
    getProductRules: (productId) => {
        return apiClient.get(`${RULES_URL}/product/${productId}`);
    },
    addRule: (rule) => {
        console.log("Sending rule to backend:", rule); // Debugging log
        return apiClient.post(RULES_URL, rule);
    },
    updateRule: (id, rule) => {
        return apiClient.put(`${RULES_URL}/${id}`, rule);
    },
    deleteRule: (id) => {
        return apiClient.delete(`${RULES_URL}/${id}`);
    },
};

export default ruleService; 