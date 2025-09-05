// Global variables
        let currentPage = 'dashboard';
        let products = [];
        let rules = [];
        let recipes = [];
        let cocktails = [];
        let suppliers = [];

        // Navigation
        function showPage(pageId) {
            // Hide all pages
            const pages = document.querySelectorAll('.page');
            pages.forEach(page => page.style.display = 'none');
            // Show selected page
            const selected = document.getElementById(pageId);
            if (selected) selected.style.display = 'block';
            // Update navigation active state
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => item.classList.remove('active'));
            // Find the nav-item that triggered the event
            // Use event delegation for robustness
            navItems.forEach(item => {
                if (item.getAttribute('onclick') && item.getAttribute('onclick').includes(pageId)) {
                    item.classList.add('active');
                }
            });
            
            currentPage = pageId;
            
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                document.getElementById('sidebar').classList.remove('mobile-open');
            }
        }

        // Mobile menu toggle
        function toggleMobileMenu() {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('mobile-open');
        }

        // Modal functions
        function showModal(modalId) {
            document.getElementById(modalId).classList.add('active');
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('active');
        }

        // Product management
        function addProduct(event) {
            event.preventDefault();
            
            const name = document.getElementById('product-name').value;
            const category = document.getElementById('product-category').value;
            const price = document.getElementById('product-price').value;
            const unit = document.getElementById('product-unit').value === 'custom' ? 
                       document.getElementById('custom-unit').value : 
                       document.getElementById('product-unit').value;
            const stock = document.getElementById('product-stock').value;
            const expiry = document.getElementById('product-expiry').value;
            
            const table = document.getElementById('products-table');
            const row = table.insertRow();
            row.innerHTML = `
                <td>${name}</td>
                <td>${category}</td>
                <td>€${parseFloat(price).toFixed(2)}</td>
                <td>${unit}</td>
                <td>${stock}</td>
                <td>${expiry || 'N/A'}</td>
                <td>
                    <button class="btn" style="padding: 5px 10px; font-size: 0.8rem;" onclick="editProduct(this)">Edit</button>
                    <button class="btn btn-danger" style="padding: 5px 10px; font-size: 0.8rem;" onclick="deleteProduct(this)">Delete</button>
                </td>
            `;
            
            closeModal('add-product-modal');
            event.target.reset();
            
            // Apply existing rules to the new product
            applyRulesToProduct(row);
        }

        function editProduct(button) {
            alert('Edit product functionality would be implemented here');
        }

        function deleteProduct(button) {
            if (confirm('Are you sure you want to delete this product?')) {
                button.closest('tr').remove();
            }
        }

        // Rule management
        function addRule(event) {
            event.preventDefault();
            
            const name = document.getElementById('rule-name').value;
            const field = document.getElementById('rule-field').value;
            const comparator = document.getElementById('rule-comparator').value;
            const value = document.getElementById('rule-value').value;
            const color = document.getElementById('rule-color').value;
            
            // Add rule to the rules list in manage modal
            const rulesList = document.getElementById('rules-list');
            const ruleDiv = document.createElement('div');
            ruleDiv.className = 'rule-item';
            ruleDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${name}</strong><br>
                        ${field.charAt(0).toUpperCase() + field.slice(1)} ${comparator} ${value}
                        <div style="width: 30px; height: 15px; background: ${color}; border: 1px solid #ccc; margin-top: 5px;"></div>
                    </div>
                    <div>
                        <button class="btn" style="padding: 5px 10px; font-size: 0.8rem;" onclick="editRule('${name}')">Edit</button>
                        <button class="btn btn-danger" style="padding: 5px 10px; font-size: 0.8rem;" onclick="deleteRule('${name}')">Delete</button>
                    </div>
                </div>
            `;
            rulesList.appendChild(ruleDiv);
            
            // Store rule
            rules.push({ name, field, comparator, value: parseFloat(value), color });
            
            // Apply rule to existing products
            applyRuleToAllProducts();
            
            closeModal('add-rule-modal');
            event.target.reset();
        }

        function applyRuleToAllProducts() {
            const table = document.getElementById('products-table');
            const rows = table.querySelectorAll('tr');
            rows.forEach(row => applyRulesToProduct(row));
        }

        function applyRulesToProduct(row) {
            rules.forEach(rule => {
                const cells = row.cells;
                if (!cells || cells.length < 5) return;
                
                let cellValue;
                let ruleMatches = false;
                
                switch(rule.field) {
                    case 'stock':
                        cellValue = parseInt(cells[4].textContent);
                        break;
                    case 'price':
                        cellValue = parseFloat(cells[2].textContent.replace('€', ''));
                        break;
                    case 'expiry':
                        const expiryDate = new Date(cells[5].textContent);
                        const today = new Date();
                        cellValue = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
                        break;
                }
                
                // Check if rule matches
                switch(rule.comparator) {
                    case '<':
                        ruleMatches = cellValue < rule.value;
                        break;
                    case '<=':
                        ruleMatches = cellValue <= rule.value;
                        break;
                    case '=':
                        ruleMatches = cellValue === rule.value;
                        break;
                    case '>=':
                        ruleMatches = cellValue >= rule.value;
                        break;
                    case '>':
                        ruleMatches = cellValue > rule.value;
                        break;
                }
                
                if (ruleMatches) {
                    row.style.backgroundColor = rule.color;
                }
            });
        }

        function editRule(ruleName) {
            alert('Edit rule functionality would be implemented here');
        }

        function deleteRule(ruleName) {
            if (confirm('Are you sure you want to delete this rule?')) {
                // Remove from rules array
                rules = rules.filter(rule => rule.name !== ruleName);
                
                // Remove from UI
                event.target.closest('.rule-item').remove();
                
                // Reapply remaining rules to all products
                const table = document.getElementById('products-table');
                const rows = table.querySelectorAll('tr');
                rows.forEach(row => {
                    row.style.backgroundColor = '';
                    applyRulesToProduct(row);
                });
            }
        }

        // Filter functions
        function filterProducts() {
            const categoryFilter = document.getElementById('category-filter').value;
            const table = document.getElementById('products-table');
            const rows = table.querySelectorAll('tr');
            
            rows.forEach(row => {
                if (!categoryFilter || row.cells[1].textContent === categoryFilter) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }

        function filterByRule() {
            const ruleFilter = document.getElementById('rule-filter').value;
            
            if (!ruleFilter) {
                filterProducts();
                return;
            }
            
            const table = document.getElementById('products-table');
            const rows = table.querySelectorAll('tr');
            
            rows.forEach(row => {
                const cells = row.cells;
                let showRow = false;
                
                switch(ruleFilter) {
                    case 'low-stock':
                        showRow = parseInt(cells[4].textContent) < 10;
                        break;
                    case 'expired-soon':
                        const expiryDate = new Date(cells[5].textContent);
                        const today = new Date();
                        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
                        showRow = daysUntilExpiry <= 7;
                        break;
                    case 'high-price':
                        showRow = parseFloat(cells[2].textContent.replace('€', '')) > 5;
                        break;
                }
                
                row.style.display = showRow ? '' : 'none';
            });
        }

        // Recipe management
        function addRecipe(event) {
            event.preventDefault();
            
            const name = document.getElementById('recipe-name').value;
            const servings = document.getElementById('recipe-servings').value;
            const prepTime = document.getElementById('recipe-prep-time').value;
            
            // Get ingredients
            const ingredientRows = document.querySelectorAll('#recipe-ingredients .ingredient-row');
            const ingredients = [];
            let totalCost = 0;
            
            ingredientRows.forEach(row => {
                const inputs = row.querySelectorAll('input, select');
                const ingredient = inputs[0].value;
                const quantity = parseFloat(inputs[1].value);
                const unit = inputs[2].value;
                const cost = Math.random() * 5; // Mock cost calculation
                
                ingredients.push({ ingredient, quantity, unit, cost });
                totalCost += cost;
            });
            
            const costPerServing = (totalCost / servings).toFixed(2);
            
            // Add to recipes container
            const container = document.getElementById('recipes-container');
            const recipeDiv = document.createElement('div');
            recipeDiv.className = 'card';
            
            let ingredientHTML = '';
            ingredients.forEach(ing => {
                ingredientHTML += `
                    <div class="ingredient-item">
                        <span>${ing.ingredient}: ${ing.quantity}${ing.unit}</span>
                        <span>€${ing.cost.toFixed(2)}</span>
                    </div>
                `;
            });
            
            recipeDiv.innerHTML = `
                <h4>${name}</h4>
                <p><strong>Servings:</strong> ${servings} | <strong>Prep Time:</strong> ${prepTime} min</p>
                ${ingredientHTML}
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee;">
                    <strong>Total Cost: €${totalCost.toFixed(2)} | Cost per Serving: €${costPerServing}</strong>
                </div>
                <div style="margin-top: 1rem;">
                    <button class="btn" onclick="editRecipe('${name.toLowerCase().replace(/\s+/g, '-')}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteRecipe('${name.toLowerCase().replace(/\s+/g, '-')}')">Delete</button>
                </div>
            `;
            
            container.appendChild(recipeDiv);
            closeModal('add-recipe-modal');
            event.target.reset();
            resetIngredients('recipe-ingredients');
        }

        function addIngredientRow() {
            const container = document.getElementById('recipe-ingredients');
            const row = document.createElement('div');
            row.className = 'ingredient-row';
            row.style = 'display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 10px; margin-bottom: 10px; align-items: end;';
            row.innerHTML = `
                <div class="form-group">
                    <input type="text" class="form-control" placeholder="Ingredient name" required>
                </div>
                <div class="form-group">
                    <input type="number" step="0.01" class="form-control" placeholder="Amount" required>
                </div>
                <div class="form-group">
                    <select class="form-control" required>
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                        <option value="ml">ml</option>
                        <option value="l">l</option>
                        <option value="piece">piece</option>
                        <option value="tbsp">tbsp</option>
                        <option value="tsp">tsp</option>
                    </select>
                </div>
                <button type="button" class="btn btn-danger" style="padding: 10px;" onclick="removeIngredient(this)">×</button>
            `;
            container.appendChild(row);
        }

        function removeIngredient(button) {
            button.closest('.ingredient-row').remove();
        }

        function resetIngredients(containerId) {
            const container = document.getElementById(containerId);
            const rows = container.querySelectorAll('.ingredient-row');
            rows.forEach((row, index) => {
                if (index > 0) row.remove(); // Keep first row, remove others
            });
            // Clear first row
            const firstRow = container.querySelector('.ingredient-row');
            if (firstRow) {
                firstRow.querySelectorAll('input').forEach(input => input.value = '');
                firstRow.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
            }
        }

        function editRecipe(recipeId) {
            alert('Edit recipe functionality would be implemented here');
        }

        function deleteRecipe(recipeId) {
            if (confirm('Are you sure you want to delete this recipe?')) {
                event.target.closest('.card').remove();
            }
        }

        // Cocktail management
        function addCocktail(event) {
            event.preventDefault();
            
            const name = document.getElementById('cocktail-name').value;
            const glass = document.getElementById('cocktail-glass').value;
            const prepTime = document.getElementById('cocktail-prep-time').value;
            const sellingPrice = parseFloat(document.getElementById('cocktail-price').value);
            
            // Get ingredients
            const ingredientRows = document.querySelectorAll('#cocktail-ingredients .ingredient-row');
            const ingredients = [];
            let totalCost = 0;
            
            ingredientRows.forEach(row => {
                const inputs = row.querySelectorAll('input, select');
                const ingredient = inputs[0].value;
                const quantity = parseFloat(inputs[1].value);
                const unit = inputs[2].value;
                const cost = Math.random() * 2; // Mock cost calculation
                
                ingredients.push({ ingredient, quantity, unit, cost });
                totalCost += cost;
            });
            
            const profit = (sellingPrice - totalCost).toFixed(2);
            
            // Add to cocktails container
            const container = document.getElementById('cocktails-container');
            const cocktailDiv = document.createElement('div');
            cocktailDiv.className = 'card';
            
            let ingredientHTML = '';
            ingredients.forEach(ing => {
                ingredientHTML += `
                    <div class="ingredient-item">
                        <span>${ing.ingredient}: ${ing.quantity}${ing.unit}</span>
                        <span>€${ing.cost.toFixed(2)}</span>
                    </div>
                `;
            });
            
            cocktailDiv.innerHTML = `
                <h4>${name}</h4>
                <p><strong>Glass:</strong> ${glass} | <strong>Prep Time:</strong> ${prepTime} min</p>
                ${ingredientHTML}
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee;">
                    <strong>Total Cost: €${totalCost.toFixed(2)} | Selling Price: €${sellingPrice.toFixed(2)} | Profit: €${profit}</strong>
                </div>
                <div style="margin-top: 1rem;">
                    <button class="btn" onclick="editCocktail('${name.toLowerCase().replace(/\s+/g, '-')}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteCocktail('${name.toLowerCase().replace(/\s+/g, '-')}')">Delete</button>
                </div>
            `;
            
            container.appendChild(cocktailDiv);
            closeModal('add-cocktail-modal');
            event.target.reset();
            resetIngredients('cocktail-ingredients');
        }

        function addCocktailIngredientRow() {
            const container = document.getElementById('cocktail-ingredients');
            const row = document.createElement('div');
            row.className = 'ingredient-row';
            row.style = 'display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 10px; margin-bottom: 10px; align-items: end;';
            row.innerHTML = `
                <div class="form-group">
                    <input type="text" class="form-control" placeholder="Ingredient name" required>
                </div>
                <div class="form-group">
                    <input type="number" step="0.01" class="form-control" placeholder="Amount" required>
                </div>
                <div class="form-group">
                    <select class="form-control" required>
                        <option value="ml">ml</option>
                        <option value="l">l</option>
                        <option value="dash">dash</option>
                        <option value="splash">splash</option>
                        <option value="piece">piece</option>
                        <option value="slice">slice</option>
                        <option value="leaves">leaves</option>
                    </select>
                </div>
                <button type="button" class="btn btn-danger" style="padding: 10px;" onclick="removeCocktailIngredient(this)">×</button>
            `;
            container.appendChild(row);
        }

        function removeCocktailIngredient(button) {
            button.closest('.ingredient-row').remove();
        }

        function editCocktail(cocktailId) {
            alert('Edit cocktail functionality would be implemented here');
        }

        function deleteCocktail(cocktailId) {
            if (confirm('Are you sure you want to delete this cocktail?')) {
                event.target.closest('.card').remove();
            }
        }

        // Supplier management
        function addSupplier(event) {
            event.preventDefault();
            
            const name = document.getElementById('supplier-name').value;
            const category = document.getElementById('supplier-category').value;
            const email = document.getElementById('supplier-email').value;
            const phone = document.getElementById('supplier-phone').value;
            const rating = document.getElementById('supplier-rating').value;
            const priceRange = document.getElementById('supplier-price-range').value;
            
            // Generate stars display
            const starsDisplay = '⭐'.repeat(parseInt(rating));
            
            // Add to suppliers table
            const table = document.getElementById('suppliers-table');
            const row = table.insertRow();
            row.innerHTML = `
                <td>${name}</td>
                <td>${category}</td>
                <td>${email}<br>${phone}</td>
                <td>${starsDisplay}</td>
                <td>${priceRange}</td>
                <td>
                    <button class="btn" style="padding: 5px 10px; font-size: 0.8rem;" onclick="viewSupplier('${name.toLowerCase().replace(/\s+/g, '-')}')">View</button>
                    <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 0.8rem;" onclick="editSupplier('${name.toLowerCase().replace(/\s+/g, '-')}')">Edit</button>
                </td>
            `;
            
            closeModal('add-supplier-modal');
            event.target.reset();
        }

        function viewSupplier(supplierId) {
            alert('View supplier details functionality would be implemented here');
        }

        function editSupplier(supplierId) {
            alert('Edit supplier functionality would be implemented here');
        }

        function compareSuppliers() {
            alert('Supplier comparison tool would be implemented here with detailed price and quality comparisons');
        }

        // Export functions
        function exportPDF(type) {
            alert(`Export ${type} to PDF functionality would be implemented here using libraries like jsPDF`);
        }

        function exportShoppingList() {
            alert('Export shopping list functionality would be implemented here - this would generate a PDF list of items that need to be ordered based on low stock rules');
        }

        function generateReport() {
            alert('Generate financial report functionality would be implemented here');
        }

        // Handle custom unit selection
        document.getElementById('product-unit').addEventListener('change', function() {
            const customUnitGroup = document.getElementById('custom-unit-group');
            if (this.value === 'custom') {
                customUnitGroup.style.display = 'block';
            } else {
                customUnitGroup.style.display = 'none';
            }
        });

        // Close modals when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.classList.remove('active');
            }
        });

        // Handle responsive design
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                document.getElementById('sidebar').classList.remove('mobile-open');
            }
        });

        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            // Apply existing rules to products on page load
            applyRuleToAllProducts();
            
            // Add click handlers to navigation items
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach((item, index) => {
                if (index === 0) return; // Skip first item (already has onclick)
                
                item.addEventListener('click', function() {
                    const pages = ['dashboard', 'profit-loss', 'inventory', 'chef-recipes', 'bar-recipes', 'suppliers'];
                    const pageId = pages[index];
                    if (pageId) {
                        showPage(pageId);
                        
                        // Update active nav item
                        navItems.forEach(nav => nav.classList.remove('active'));
                        this.classList.add('active');
                    }
                });
            });
        });

        // Demo data initialization
        function initializeDemoData() {
            // This would populate the system with sample data for demonstration
            console.log('Demo data initialized');
        }

        // Call demo data initialization
        initializeDemoData();
