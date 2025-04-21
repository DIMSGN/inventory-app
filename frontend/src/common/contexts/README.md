# Context Architecture

This directory contains React Context providers that manage different aspects of the application's state.

## Architecture Overview

The context architecture follows a composable pattern:

- **Specialized Contexts**: Each domain has its own dedicated context (Products, Categories, Recipes, etc.)
- **AppContext**: Composes all specialized contexts and provides a unified access point

## Key Principles

1. **Separation of Concerns**: Each context handles its own domain
2. **Standard Patterns**: Contexts follow consistent patterns for state, operations, and error handling
3. **Caching Strategy**: Most contexts implement local storage caching for faster initial loads
4. **Standardized Configuration**: All contexts use shared configuration from `common/config.js`

## Context Usage

### Individual Context Access

Import and use specialized contexts directly when you only need data from one domain:

```jsx
import { useProducts } from '../common/contexts/ProductsContext';

function ProductList() {
  const { products, loading, error } = useProducts();
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

### App Context Access

Use the AppContext when you need access to multiple domains:

```jsx
import { useAppContext } from '../common/contexts/AppContext';

function Dashboard() {
  const { 
    products,
    categories,
    rules 
  } = useAppContext();
  
  // Access data from different contexts
  const totalProducts = products.products.length;
  const categoryNames = categories.categories.map(c => c.name);
  
  // Reload all data
  const handleRefresh = () => {
    appContext.reloadAllData();
  };
  
  return (
    <div>
      <button onClick={handleRefresh}>Refresh All Data</button>
      <p>Total Products: {totalProducts}</p>
      <p>Categories: {categoryNames.join(', ')}</p>
    </div>
  );
}
```

## Available Contexts

| Context | Purpose | Key Features |
|---------|---------|-------------|
| AppContext | Root context that composes all others | Data reloading across all contexts |
| ProductsContext | Manages inventory products | Product filtering by category |
| CategoriesContext | Manages product categories | CRUD operations for categories |
| RulesContext | Manages inventory rules | Rule color calculation for products |
| RecipesContext | Manages food/drink recipes | Recipe filtering by type |
| UnitsContext | Manages measurement units | Unit conversion |
| SuppliersContext | Manages product suppliers | Supplier filtering and CRUD |
| EconomyContext | Manages financial data | Sales tracking, expense management |
| ModalContext | Manages UI modals | Modal opening/closing, modal data | 