# API Services

## Service Consolidation

All API services have been consolidated into a single file `apiServices.js` to simplify maintenance and imports. The following services are now available from this file:

- `productService` - For product-related API calls
- `ruleService` - For rule-related API calls
- `categoryService` - For category-related API calls

## How to Import

### Named Imports (Recommended)

```javascript
// Import just what you need
import { productService } from '../services/apiServices';
import { ruleService } from '../services/apiServices';
import { categoryService } from '../services/apiServices';

// Or import multiple services
import { productService, ruleService } from '../services/apiServices';
```

### Default Import

```javascript
// Import all services
import apiServices from '../services/apiServices';

// Then use them
apiServices.productService.getProducts();
apiServices.ruleService.getRules();
apiServices.categoryService.getCategories();
```

## Migration Guide

If your code previously imported services from individual files like:

```javascript
import productService from '../services/productService';
import ruleService from '../services/ruleService';  
import categoryService from '../services/categoryService';
```

Update to:

```javascript
import { productService, ruleService, categoryService } from '../services/apiServices';
```

No changes are needed to how you call the service methods as the APIs remain the same. 