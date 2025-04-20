# Common Services

This directory contains all the shared API service modules used throughout the application. 

## Services Organization

The services are organized in a way that promotes code reuse and maintainability:

- Each service module provides a set of methods that handle API interactions for a specific resource
- All services are exported from the `index.js` file for easy importing
- Services use consistent error handling and response formatting

## Available Services

The following services are available:

| Service | Description |
|---------|-------------|
| `apiServices` | General services collection with various utility API methods |
| `api` | Core API instance with interceptors and authentication handling |
| `toastService` | Notification services for success/error feedback |
| `productService` | Product management (CRUD operations) |
| `categoryService` | Category management operations |
| `ruleService` | Inventory rules management |
| `recipeService` | Recipe management operations |

## How to Use

Import services from the common/services directory:

```javascript
// Single service import
import { productService } from '../../common/services';

// Multiple service imports
import { productService, toastService } from '../../common/services';
```

## Extending Services

To add a new service:

1. Create a new service file (e.g., `newService.js`) with your API methods
2. Export the service as the default export
3. Add the service to the `index.js` exports

Example new service:

```javascript
// newService.js
import axios from 'axios';

const API_URL = '/api/newresource';

const newService = {
  getAll: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },
  
  getById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },
  
  // Add more methods as needed
};

export default newService;
```

Then update the index.js:

```javascript
// Add to index.js
import newService from './newService';

export {
  // Existing exports
  newService
}; 