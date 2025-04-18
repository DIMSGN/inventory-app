import React, { useState, useEffect, Suspense, lazy } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

// Regular imports
import Header from "./components/Header/Header";
import Modal from "./components/common/Modal/Modal";
import ColorSelect from "./components/common/ColorSelect/ColorSelect";
import { Icon } from "./components/common";
import { useAppContext } from "./context/AppContext";
import { colors } from "./utils/colors";
import { showError } from "./services/toastService";

// Lazy loaded components
const ProductTable = lazy(() => import("./components/ProductTable/ProductTable"));
const RuleList = lazy(() => import("./components/RuleList/RuleList"));
const Sidebar = lazy(() => import("./components/Sidebar/Sidebar"));
const AddProductForm = lazy(() => import("./components/ProductTable/ProductForm/AddProductForm"));
const EditProductForm = lazy(() => import("./components/ProductTable/ProductForm/EditProductForm"));
const Dashboard = lazy(() => import("./components/Dashboard/Dashboard"));
const Economy = lazy(() => import("./components/Economy/Economy"));

// Create a simple RuleModal component using our generic Modal
const RuleModal = ({ 
  currentProduct, 
  formData, 
  handleChange, 
  handleSubmit, 
  setIsRuleModalOpen, 
  products, 
  rules, 
  setFormData, 
  handleColorChange,
  isEditing
}) => {
  const colorOptions = colors.map(color => ({
    value: color.value,
    label: color.name
  }));
  
  return (
    <Modal 
      onClose={() => setIsRuleModalOpen(false)}
      title={isEditing 
        ? `Edit Rule for ${currentProduct?.product_name || 'Product'}`
        : `Add Rule for ${currentProduct?.product_name || 'Product'}`
      }
    >
      {formData && (
        <form onSubmit={handleSubmit} className="ruleForm">
          {/* Hidden fields - not displayed but still used for functionality */}
          {currentProduct && (
            <input
              type="hidden"
              name="product_id"
              value={currentProduct.product_id || ""}
            />
          )}
          
          {/* Display current product amount for reference */}
          {currentProduct && (
            <div className="form-group">
              <label>
                <Icon className="fas fa-box-open" /> Current Stock Amount:
                <input
                  type="text"
                  value={currentProduct.amount}
                  readOnly
                  disabled
                  className="disabled-input"
                />
              </label>
            </div>
          )}
          
          <div className="form-group">
            <label>
              <Icon className="fas fa-tag" /> Product Name:
              <input
                type="text"
                name="rules"
                value={formData.rules || ""}
                onChange={handleChange}
                required
                placeholder="Rule description"
                readOnly={currentProduct !== null}
                disabled={currentProduct !== null}
                className={currentProduct !== null ? "disabled-input" : ""}
              />
            </label>
          </div>
          
          <div className="form-group">
            <label>
              <Icon className="fas fa-not-equal" /> Comparison:
              <select
                name="comparison"
                value={formData.comparison || "="}
                onChange={handleChange}
                required
              >
                <option value="=">=</option>
                <option value="<">&lt;</option>
                <option value=">">&gt;</option>
                <option value="<=">&lt;=</option>
                <option value=">=">&gt;=</option>
              </select>
            </label>
          </div>
          
          <div className="form-group">
            <label>
              <Icon className="fas fa-calculator" /> Amount:
              <input
                type="number"
                name="amount"
                value={formData.amount || ""}
                onChange={handleChange}
                required
                placeholder="Enter threshold amount"
              />
            </label>
          </div>
          
          <div className="form-group">
            <label>
              <Icon className="fas fa-palette" /> Color:
              <ColorSelect
                name="color"
                value={formData.color || "#ff0000"}
                onChange={(selectedOption) => handleColorChange(selectedOption)}
                options={colorOptions}
              />
            </label>
          </div>
          
          <div className="buttonGroup">
            <button type="submit" className="button success">
              <Icon className="fas fa-save" /> Save
            </button>
            <button type="button" className="button secondary" onClick={() => setIsRuleModalOpen(false)}>
              <Icon className="fas fa-times" /> Cancel
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Local UI state
  const [activeModal, setActiveModal] = useState(null); // 'product', 'edit', 'rule' or null
  const [showRuleList, setShowRuleList] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Get state and methods from AppContext
  const {
    products,
    rules,
    currentRule,
    editingProduct,
    setCurrentRule,
    setEditingProduct,
    addRule,
    updateRule,
    deleteRule,
    deleteProduct,
    updateProduct
  } = useAppContext();

  // Handler functions
  const handleToggleRuleList = () => setShowRuleList(!showRuleList);
  
  // Modal handlers
  const openAddProductModal = () => {
    setActiveModal('product');
  };
  
  const openEditProductModal = (product) => {
    setEditingProduct(product);
    setActiveModal('edit');
  };
  
  const openRuleModal = (rule = null, product = null) => {
    // If editing an existing rule
    if (rule) {
      setCurrentRule(rule);
      // Get the product associated with this rule
      const associatedProduct = product || 
        products.find(p => p.product_id === rule.product_id);
      setCurrentProduct(associatedProduct);
    } 
    // If adding a new rule for a specific product
    else if (product) {
      setCurrentProduct(product);
      // Initialize a new rule with the product's ID and name
      setCurrentRule({
        product_id: product.product_id,
        rules: product.product_name, // Auto-populate rule name with product name
        comparison: ">",
        amount: 0,
        color: "#ff0000",
      });
    } 
    // Generic new rule (without preselected product)
    else {
      setCurrentProduct(null);
      setCurrentRule({
        product_id: null,
        rules: "",
        comparison: ">",
        amount: 0,
        color: "#ff0000",
      });
    }
    setActiveModal('rule');
  };
  
  const closeModal = () => {
    setActiveModal(null);
    if (editingProduct) setEditingProduct(null);
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Check required fields
    if (!currentRule?.rules || !currentRule?.comparison || currentRule?.amount === undefined || !currentRule?.color) {
      showError("All fields except product_id are required");
      return;
    }

    // For editing an existing rule
    if (currentRule && currentRule.id) {
      // Update existing rule
      const success = await updateRule(currentRule);
      if (success) closeModal();
    } 
    // For adding a new rule
    else {
      // Check if adding a rule for a product that doesn't exist
      if (!currentProduct && (!currentRule.product_id || !products.some(p => p.product_id === currentRule.product_id))) {
        showError("Cannot add a rule without selecting a valid product");
        return;
      }
      
      // Make sure we have the correct product_id
      const newRule = {
        product_id: currentProduct ? currentProduct.product_id : (currentRule?.product_id || null),
        rules: currentRule?.rules || "",
        comparison: currentRule?.comparison || ">",
        amount: currentRule?.amount || 0,
        color: currentRule?.color || "#ff0000",
      };
      
      console.log("Submitting new rule:", newRule); // For debugging
      
      const success = await addRule(newRule);
      if (success) {
        setCurrentRule(null);
        setCurrentProduct(null);
        closeModal();
      }
    }
  };

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  // Handle sidebar navigation
  const handleNavigation = (item) => {
    switch(item) {
      case 'dashboard':
        navigate('/');
        break;
      case 'products':
        navigate('/products');
        break;
      case 'economy':
        navigate('/economy');
        break;
      default:
        navigate('/');
    }
  };
  
  // Determine active sidebar item from current path
  const getActiveItemFromPath = () => {
    const path = location.pathname;
    if (path === '/') return 'dashboard';
    if (path.includes('products')) return 'products';
    if (path.includes('economy')) return 'economy';
    return 'dashboard';
  };

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    if (savedSidebarState !== null) {
      setSidebarCollapsed(JSON.parse(savedSidebarState));
    }
  }, []);

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  return (
    <div className={`app-wrapper ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Suspense fallback={<div>Loading sidebar...</div>}>
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={toggleSidebar}
          activeItem={getActiveItemFromPath()}
          onNavigation={handleNavigation}
        />
      </Suspense>
      <div className="main-content">
        <Header />
        <div className="container">
          <Suspense fallback={<div>Loading content...</div>}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={
                <>
                  <ProductTable
                    onAddProductClick={openAddProductModal}
                    onToggleRuleList={handleToggleRuleList}
                    showRuleList={showRuleList}
                    setCurrentRule={setCurrentRule}
                    setEditingProduct={openEditProductModal}
                    setCurrentProduct={setCurrentProduct}
                    openRuleModal={openRuleModal}
                    handleDeleteProduct={deleteProduct}
                  />
                  
                  {showRuleList && (
                    <div className="ruleContainer">
                      <RuleList
                        rules={rules}
                        onAddRule={() => openRuleModal()}
                        onEditRule={(rule) => openRuleModal(rule)}
                        onDeleteRule={deleteRule}
                      />
                    </div>
                  )}
                </>
              } />
              <Route path="/economy" element={<Economy />} />
            </Routes>
          </Suspense>
          
          {/* Render modals based on activeModal state */}
          {activeModal === 'product' && (
            <Modal onClose={closeModal} title="Add New Product">
              <Suspense fallback={<div>Loading form...</div>}>
                <AddProductForm onClose={closeModal} />
              </Suspense>
            </Modal>
          )}
          
          {activeModal === 'edit' && editingProduct && (
            <Modal onClose={closeModal} title={`Edit Product: ${editingProduct.product_name}`}>
              <Suspense fallback={<div>Loading form...</div>}>
                <EditProductForm
                  product={editingProduct}
                  onClose={closeModal}
                  onUpdateProduct={updateProduct}
                />
              </Suspense>
            </Modal>
          )}
          
          {activeModal === 'rule' && (
            <RuleModal
              currentProduct={currentProduct}
              formData={currentRule || {}}
              handleChange={(e) => setCurrentRule({ ...currentRule, [e.target.name]: e.target.value })}
              handleSubmit={handleFormSubmit}
              setIsRuleModalOpen={closeModal}
              products={products}
              rules={rules}
              setFormData={setCurrentRule}
              handleColorChange={(selectedOption) => setCurrentRule({ ...currentRule, color: selectedOption.value })}
              isEditing={currentRule && currentRule.id ? true : false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
