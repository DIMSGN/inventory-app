# Common Services

This directory contains all the shared API service modules used throughout the application.

## Services Architecture

The services are organized in a way that promotes code reuse and maintainability, with two implementation styles:

1. **Individual Service Files**: Focused service modules for each domain (products, categories, etc.)
2. **apiServices.js**: Consolidated service collection with enhanced error handling and retry logic

## API Configuration

All services use the centralized configuration from `common/config.js` which defines:
- `API_URL`: The base URL for all API requests
- Environment-specific settings

## Troubleshooting "API Health Check Failed" Errors

If you see `API Health Check Failed: Failed to fetch` in the console:

1. **Check Backend Connection**: Make sure your backend API is running at the URL specified in your `.env` file
2. **Verify CORS Settings**: Ensure your backend allows requests from your frontend domain
3. **Check /health Endpoint**: Make sure your backend has a `/health` endpoint that returns a 2xx status

To temporarily disable the health check (for development), you can:
1. Edit `apiServices.js` and comment out the health check section
2. Set `NODE_ENV=test` when running your application

## Available Services

The following services are available:

| Service | Description | Import Path |
|---------|-------------|------------|
| `api` | Core axios instance with interceptors | `import { api } from '../services'` |
| `toastService` | Notification service for user feedback | `import { toastService } from '../services'` |
| `productService` | Product management (CRUD) | `import { productService } from '../services'` |
| `categoryService` | Category management | `import { categoryService } from '../services'` |
| `ruleService` | Inventory rule management | `import { ruleService } from '../services'` |
| `recipeService` | Recipe management | `import { recipeService } from '../services'` |
| `supplierService` | Supplier management | `import { supplierService } from '../services'` |
| `invoiceService` | Invoice operations | `import { invoiceService } from '../services'` |
| `salesService` | Sales recording | `import { salesService } from '../services'` |
| `expensesService` | Expense tracking | `import { expensesService } from '../services'` |

## How to Use

Import services from the common/services directory:

```javascript
// Single service import
import { productService } from '../../common/services';

// Multiple service imports
import { productService, toastService } from '../../common/services';
```

## Error Handling

All services include standardized error handling that:
1. Logs detailed error information to the console
2. Adds retry logic for network errors
3. Returns appropriate error responses

## Extending Services

To add a new service:

1. Create a new service file (e.g., `newService.js`) with your API methods
2. Make sure to import and use the `apiClient` from `api.js`
3. Add the service to the `index.js` exports

Example new service:

```javascript
// newService.js
import apiClient from './api';

const NEW_RESOURCE_URL = "/newresource";

const newService = {
  getAll: async () => {
    return apiClient.get(NEW_RESOURCE_URL)
      .then(response => response.data)
      .catch(error => {
        console.error("Error fetching resources:", error);
        throw error;
      });
  },
  
  getById: async (id) => {
    return apiClient.get(`${NEW_RESOURCE_URL}/${id}`)
      .then(response => response.data)
      .catch(error => {
        console.error(`Error fetching resource ${id}:`, error);
        throw error;
      });
  },
  
  // Add more methods as needed
};

export default newService;