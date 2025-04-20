// Inventory feature exports
import ProductTable from './components/ProductTable/ProductTable';
import Units from './components/Units/Units';
import Categories from './components/Categories/Categories';

// Rule management components
import { 
  RuleManager, 
  RuleList, 
  RuleModal, 
  AddRuleForm 
} from './components';

// Pages
import RuleManagementPage from './pages/RuleManagement';
import InventorySettingsPage from './pages/InventorySettings';

// Services (imported from common/services)
import { 
  productService,
  categoryService,
  ruleService
} from '../../common/services';

// Export all Inventory components and services
export {
  // Components
  ProductTable,
  Units,
  Categories,
  RuleManager,
  RuleList,
  RuleModal,
  AddRuleForm,
  
  // Pages
  RuleManagementPage,
  InventorySettingsPage,
  
  // Services
  productService,
  categoryService,
  ruleService
};

// Add a default export for the Inventory feature
const InventoryFeature = {
  ProductTable,
  Units,
  Categories,
  RuleManager,
  RuleList,
  RuleModal,
  AddRuleForm,
  RuleManagementPage,
  InventorySettingsPage
};

export default InventoryFeature; 