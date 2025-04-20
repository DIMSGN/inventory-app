import React, { useState, useEffect } from 'react';
import { 
  RuleManager, 
  RuleIndicator, 
  ProductTable 
} from '../components';
import { 
  useRuleFiltering
} from '../hooks';

/**
 * Example component demonstrating use of the rule management components
 * This is for reference only - copy and adapt as needed
 */
const RuleManagementExample = () => {
  // Example state
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showOnlyWithRules, setShowOnlyWithRules] = useState(false);
  
  // Get rule filtering functionality
  const { 
    filterProductsByRules,
    sortProductsByRuleSeverity 
  } = useRuleFiltering();
  
  // Fetch products (in real code, this would come from an API)
  useEffect(() => {
    // Mock products for the example
    setProducts([
      { product_id: '1', product_name: 'Widget A', amount: 5 },
      { product_id: '2', product_name: 'Widget B', amount: 20 },
      { product_id: '3', product_name: 'Widget C', amount: 0 }
    ]);
  }, []);
  
  // Filter and sort products based on rules
  const displayProducts = React.useMemo(() => {
    let filtered = filterProductsByRules(products, showOnlyWithRules);
    return sortProductsByRuleSeverity(filtered);
  }, [products, showOnlyWithRules, filterProductsByRules, sortProductsByRuleSeverity]);
  
  // Handle product selection
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };
  
  // Custom renderer for product name with rule indicator
  const productNameRenderer = (product) => (
    <div className="product-name-cell">
      {product.product_name}
      <RuleIndicator 
        productId={product.product_id}
        amount={product.amount}
        size="small"
      />
    </div>
  );
  
  return (
    <div className="rule-management-example">
      <h2>Inventory Management</h2>
      
      {/* Filtering controls */}
      <div className="controls">
        <label>
          <input 
            type="checkbox" 
            checked={showOnlyWithRules}
            onChange={() => setShowOnlyWithRules(!showOnlyWithRules)}
          />
          Show only products with rule alerts
        </label>
      </div>
      
      {/* Products table with rule indicators */}
      <ProductTable 
        products={displayProducts}
        onSelectProduct={handleProductSelect}
        customRenderers={{
          product_name: productNameRenderer
        }}
      />
      
      {/* Rule management section */}
      <div className="rule-management-section">
        <h3>Rule Management</h3>
        <RuleManager 
          product={selectedProduct}
          showHeader={true}
        />
      </div>
    </div>
  );
};

export default RuleManagementExample; 