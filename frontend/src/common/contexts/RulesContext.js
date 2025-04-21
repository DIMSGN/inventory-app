import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ruleService, toastService } from '../services';
import { STORAGE_KEYS } from '../config';

const { showSuccess, showError } = toastService;

const RulesContext = createContext();

export const useRules = () => useContext(RulesContext);

export const RulesProvider = ({ children }) => {
  const [rules, setRules] = useState([]);
  const [currentRule, setCurrentRule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedRules = await ruleService.getRules();
      setRules(fetchedRules.data);
      localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(fetchedRules.data));
      return fetchedRules.data;
    } catch (err) {
      console.error("Error fetching rules:", err);
      showError("Failed to load rules");
      setError('Failed to fetch rules');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a rule
  const addRule = useCallback(async (rule) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ruleService.addRule(rule);
      await fetchRules(); // Refresh rules after adding
      showSuccess("Rule added successfully");
      return response.data;
    } catch (err) {
      console.error("Error adding rule:", err);
      showError(err.message || "Failed to add rule");
      setError(err.message || 'Failed to add rule');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchRules]);

  // Update a rule
  const updateRule = useCallback(async (ruleId, updatedRule) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ruleService.updateRule(ruleId, updatedRule);
      await fetchRules(); // Refresh rules after updating
      showSuccess("Rule updated successfully");
      return response.data;
    } catch (err) {
      console.error("Error updating rule:", err);
      showError(err.message || "Failed to update rule");
      setError(err.message || 'Failed to update rule');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchRules]);

  // Delete a rule
  const deleteRule = useCallback(async (ruleId) => {
    setLoading(true);
    setError(null);
    try {
      await ruleService.deleteRule(ruleId);
      setRules(prevRules => prevRules.filter(r => r.id.toString() !== ruleId.toString()));
      showSuccess("Rule deleted successfully");
      return true;
    } catch (err) {
      console.error("Error deleting rule:", err);
      showError(err.message || "Failed to delete rule");
      setError(err.message || 'Failed to delete rule');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get product rules
  const getProductRules = useCallback(async (productId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ruleService.getProductRules(productId);
      return response.data;
    } catch (err) {
      console.error(`Error fetching rules for product ${productId}:`, err);
      setError(`Failed to fetch rules for product ${productId}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get rule color for a product based on amount
  const getRuleColor = useCallback((product) => {
    if (!product) return "";
    if (!rules || !Array.isArray(rules) || rules.length === 0) return "";
    
    // Filter rules that apply to this specific product
    const productRules = rules.filter(rule => 
      rule && rule.product_id === product.product_id
    );
    
    // If no specific rules for this product, return empty string
    if (productRules.length === 0) return "";

    const amount = parseFloat(product.amount);
    if (isNaN(amount)) return "";
    
    for (const rule of productRules) {
      if (!rule) continue;
      
      const ruleAmount = parseFloat(rule.amount);
      if (isNaN(ruleAmount)) continue;
      
      const comparison = rule.comparison;
      
      if (comparison === "<" && amount < ruleAmount) {
        return rule.color || "";
      } else if (comparison === "<=" && amount <= ruleAmount) {
        return rule.color || "";
      } else if (comparison === ">" && amount > ruleAmount) {
        return rule.color || "";
      } else if (comparison === ">=" && amount >= ruleAmount) {
        return rule.color || "";
      } else if (comparison === "=" && amount === ruleAmount) {
        return rule.color || "";
      }
    }
    
    return "";
  }, [rules]);

  // Initial fetch
  useEffect(() => {
    const loadRules = async () => {
      try {
        // Try to use cached data first for a faster initial render
        const cachedRules = localStorage.getItem(STORAGE_KEYS.RULES);
        if (cachedRules) {
          setRules(JSON.parse(cachedRules));
          console.log("Using cached rules");
        }
      } catch (error) {
        console.error("Error loading cached rules:", error);
      }
      
      // Then fetch fresh data
      await fetchRules();
    };
    
    loadRules();
  }, [fetchRules]);

  const value = {
    rules,
    currentRule,
    loading,
    error,
    setCurrentRule,
    fetchRules,
    addRule,
    updateRule,
    deleteRule,
    getProductRules,
    getRuleColor
  };

  return (
    <RulesContext.Provider value={value}>
      {children}
    </RulesContext.Provider>
  );
};

export default RulesContext; 