import React, { createContext, useContext } from "react";

// Import all specialized context providers
import { ProductsProvider, useProducts } from "./ProductsContext";
import { CategoriesProvider, useCategories } from "./CategoriesContext";
import { UnitsProvider, useUnits } from "./UnitsContext";
import { SuppliersProvider, useSuppliers } from "./SuppliersContext";
import { RecipesProvider, useRecipes } from "./RecipesContext";
import { RulesProvider, useRules } from "./RulesContext";
import { EconomyProvider, useEconomy } from "./EconomyContext";
import { ModalProvider, useModal } from "./ModalContext";

// Base API URL from environment
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Create the App context
const AppContext = createContext();

// App Provider component that combines all specialized providers
export const AppProvider = ({ children }) => {
  return (
    <ProductsProvider>
      <CategoriesProvider>
        <UnitsProvider>
          <SuppliersProvider>
            <RecipesProvider>
              <RulesProvider>
                <EconomyProvider>
                  <ModalProvider>
                    <AppContextProvider>{children}</AppContextProvider>
                  </ModalProvider>
                </EconomyProvider>
              </RulesProvider>
            </RecipesProvider>
          </SuppliersProvider>
        </UnitsProvider>
      </CategoriesProvider>
    </ProductsProvider>
  );
};

// Inner provider that composes values from all contexts
const AppContextProvider = ({ children }) => {
  // Get values from all specialized contexts
  const productsContext = useProducts();
  const categoriesContext = useCategories();
  const unitsContext = useUnits();
  const suppliersContext = useSuppliers();
  const recipesContext = useRecipes();
  const rulesContext = useRules();
  const economyContext = useEconomy();
  const modalContext = useModal();

  // Utility to reload all data from specialized contexts
  const reloadAllData = async (forceClearCache = false) => {
    console.log("Reloading all application data, force clear cache:", forceClearCache);
    
    try {
      // Reload data from all contexts
      await Promise.all([
        productsContext.fetchProducts(),
        categoriesContext.fetchCategories(),
        unitsContext.fetchUnits(),
        suppliersContext.fetchSuppliers(),
        recipesContext.fetchRecipes(),
        rulesContext.fetchRules(),
        economyContext.refreshAllData()
      ]);
      
      return true;
    } catch (error) {
      console.error("Error reloading all data:", error);
      return false;
    }
  };

  // Create combined value with all contexts plus any app-level utilities
  const value = {
    // App-level properties
    apiUrl,
    reloadAllData,
    
    // Access to specialized contexts
    products: productsContext.products || [],
    filteredProducts: productsContext.filteredProducts || [],
    categories: categoriesContext.categories || [],
    units: unitsContext.units || [],
    suppliers: suppliersContext.suppliers || [],
    recipes: recipesContext.recipes || [],
    rules: rulesContext.rules || [],
    getRuleColor: rulesContext.getRuleColor || (() => ""),
    setEditingProduct: productsContext.setEditingProduct || (() => {}),
    deleteProduct: productsContext.deleteProduct || (() => Promise.resolve()),
    editingProduct: productsContext.editingProduct || null,
    
    // Add rule functions explicitly
    addRule: rulesContext.addRule || (() => Promise.resolve()),
    updateRule: rulesContext.updateRule || (() => Promise.resolve()),
    deleteRule: rulesContext.deleteRule || (() => Promise.resolve()),
    getProductRules: rulesContext.getProductRules || (() => []),
    fetchRules: rulesContext.fetchRules || (() => Promise.resolve([])),
    isLoading: { rules: rulesContext.loading || false },

    // Add additional required functions to prevent undefined errors
    addCategory: categoriesContext.addCategory || (() => Promise.resolve()),
    fetchCategories: categoriesContext.fetchCategories || (() => Promise.resolve([])),
    setCategories: categoriesContext.setCategories || (() => {}),

    economy: economyContext,
    modal: modalContext
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = () => useContext(AppContext);

export default AppContext; 