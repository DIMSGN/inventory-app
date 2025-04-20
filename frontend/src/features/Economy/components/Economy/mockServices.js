// Mock services for the build
export const invoiceService = {
  getInvoices: () => Promise.resolve([]),
  createInvoice: () => Promise.resolve({}),
  updateInvoice: () => Promise.resolve({}),
  deleteInvoice: () => Promise.resolve({}),
};

export const supplierService = {
  getSuppliers: () => Promise.resolve([]),
  createSupplier: () => Promise.resolve({}),
  updateSupplier: () => Promise.resolve({}),
  deleteSupplier: () => Promise.resolve({}),
};

export const productService = {
  getProducts: () => Promise.resolve([]),
};

export const salesService = {
  getSales: () => Promise.resolve([]),
  createSale: () => Promise.resolve({}),
  updateSale: () => Promise.resolve({}),
  deleteSale: () => Promise.resolve({}),
  getSalesReport: () => Promise.resolve({}),
};

export const recipeService = {
  getRecipes: () => Promise.resolve([]),
}; 