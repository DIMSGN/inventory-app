const queryDatabase = require('./queryDatabase');
const runFinancialMigrations = require('./financial_migrations');

/**
 * Run database migrations to update schema
 */
async function runMigrations() {
  console.log('Starting database schema migrations...');
  
  try {
    // Check if all tables already exist
    const tableChecks = await queryDatabase(`
      SELECT 
        COUNT(*) as table_count,
        SUM(CASE WHEN TABLE_NAME = 'units' THEN 1 ELSE 0 END) as units_exists,
        SUM(CASE WHEN TABLE_NAME = 'categories' THEN 1 ELSE 0 END) as categories_exists,
        SUM(CASE WHEN TABLE_NAME = 'products' THEN 1 ELSE 0 END) as products_exists,
        SUM(CASE WHEN TABLE_NAME = 'rules' THEN 1 ELSE 0 END) as rules_exists,
        SUM(CASE WHEN TABLE_NAME = 'suppliers' THEN 1 ELSE 0 END) as suppliers_exists,
        SUM(CASE WHEN TABLE_NAME = 'product_invoices' THEN 1 ELSE 0 END) as invoices_exists,
        SUM(CASE WHEN TABLE_NAME = 'recipes' THEN 1 ELSE 0 END) as recipes_exists,
        SUM(CASE WHEN TABLE_NAME = 'inventory_log' THEN 1 ELSE 0 END) as inventory_log_exists
      FROM information_schema.tables
      WHERE table_schema = '${process.env.MYSQL_ADDON_DB}'
      AND TABLE_NAME IN (
        'units', 'categories', 'products', 'rules', 'suppliers', 
        'product_invoices', 'recipes', 'inventory_log'
      )
    `);
    
    // If most of our tables exist, we already have a complete schema
    if (tableChecks[0].table_count >= 6) {
      console.log('✓ Complete database schema already exists, skipping migrations');
      return { success: true, message: 'Schema already exists' };
    }
    
    // Create units table if it doesn't exist
    if (!tableChecks[0].units_exists) {
      await queryDatabase(`
        CREATE TABLE IF NOT EXISTS units (
          id INT AUTO_INCREMENT,
          name VARCHAR(50) NOT NULL UNIQUE,
          conversion_factor DECIMAL(10,4) NULL,
          PRIMARY KEY (id)
        );
      `);
      console.log('✓ Units table created');
    } else {
      console.log('✓ Units table already exists');
    }
    
    // Create categories table if it doesn't exist
    if (!tableChecks[0].categories_exists) {
      await queryDatabase(`
        CREATE TABLE IF NOT EXISTS categories (
          id INT AUTO_INCREMENT,
          name VARCHAR(100) NOT NULL UNIQUE,
          PRIMARY KEY (id)
        );
      `);
      console.log('✓ Categories table created');
    } else {
      console.log('✓ Categories table already exists');
    }
    
    // Ensure default units exist
    const units = ['kg', 'g', 'l', 'ml', 'piece', 'box', 'bottle', 'pack', 'grams', 'litre'];
    for (const unit of units) {
      await queryDatabase(`
        INSERT IGNORE INTO units (name) VALUES (?);
      `, [unit]);
    }
    console.log('✓ Default units verified');
    
    // Ensure default categories exist - Updated to include Excel categories
    const categories = [
      'FOOD', 'WINE', 'ΠΟΤΑ', 'ΜΠΥΡΕΣ', 'CAFE', 'EVENTS', 
      'Dairy', 'Meat', 'Produce', 'Beverages', 'Bakery', 'Dry Goods'
    ];
    
    for (const category of categories) {
      try {
        await queryDatabase(`
          INSERT IGNORE INTO categories (name) VALUES (?);
        `, [category]);
      } catch (err) {
        console.warn(`Couldn't create default category ${category}:`, err.message);
      }
    }
    console.log('✓ Default categories verified');
    
    // Handle views (always recreate these as they're not destructive)
    console.log('Creating or replacing views...');
    
    await queryDatabase(`
      CREATE OR REPLACE VIEW recipe_costs AS
      SELECT 
        r.recipe_id,
        r.name AS recipe_name,
        r.type,
        COUNT(ri.id) AS ingredient_count,
        COALESCE(
          SUM(
            CASE 
              WHEN p.pieces_per_package IS NOT NULL AND p.pieces_per_package > 0 THEN
                ri.amount * (p.purchase_price / p.pieces_per_package)
              ELSE
                (ri.amount / p.amount) * p.purchase_price 
            END
          ), 
          0
        ) AS total_cost
      FROM 
        recipes r
      LEFT JOIN 
        recipe_ingredients ri ON r.recipe_id = ri.recipe_id
      LEFT JOIN 
        products p ON ri.product_id = p.product_id
      GROUP BY 
        r.recipe_id, r.name, r.type
    `);
    console.log('✓ Updated recipe_costs view');
    
    await queryDatabase(`
      CREATE OR REPLACE VIEW daily_financial_summary AS
      SELECT 
        DATE(sale_date) AS day,
        SUM(CASE 
          WHEN table_source = 'food' THEN total_sales
          WHEN table_source = 'coffee' THEN total_sales
          WHEN table_source = 'cocktail' THEN total_sales
          WHEN table_source = 'drink' THEN total_sales
          ELSE 0 
        END) AS total_revenue,
        IFNULL(op_expenses.daily_expenses, 0) AS operating_expenses,
        IFNULL(pay_expenses.daily_payroll, 0) AS payroll_expenses,
        SUM(CASE 
          WHEN table_source = 'food' THEN total_sales
          WHEN table_source = 'coffee' THEN total_sales
          WHEN table_source = 'cocktail' THEN total_sales
          WHEN table_source = 'drink' THEN total_sales
          ELSE 0 
        END) - IFNULL(op_expenses.daily_expenses, 0) - IFNULL(pay_expenses.daily_payroll, 0) AS net_profit
      FROM (
        SELECT 'food' AS table_source, DATE(sale_date) AS sale_date, SUM(quantity_sold * sale_price) AS total_sales
        FROM food_recipes_sales
        GROUP BY DATE(sale_date)
        UNION ALL
        SELECT 'coffee' AS table_source, DATE(sale_date) AS sale_date, SUM(quantity_sold * sale_price) AS total_sales
        FROM coffees_beverages_recipes_sales
        GROUP BY DATE(sale_date)
        UNION ALL
        SELECT 'cocktail' AS table_source, DATE(sale_date) AS sale_date, SUM(quantity_sold * sale_price) AS total_sales
        FROM cocktails_recipes_sales
        GROUP BY DATE(sale_date)
        UNION ALL
        SELECT 'drink' AS table_source, DATE(sale_date) AS sale_date, SUM(quantity_sold_ml * sale_price) AS total_sales
        FROM drinks_sales
        GROUP BY DATE(sale_date)
      ) sales
      LEFT JOIN (
        SELECT expense_date AS expense_date, SUM(amount) AS daily_expenses
        FROM operating_expenses
        GROUP BY expense_date
      ) op_expenses ON sales.sale_date = op_expenses.expense_date
      LEFT JOIN (
        SELECT payroll_date AS payroll_date, SUM(amount) AS daily_payroll
        FROM payroll_expenses
        GROUP BY payroll_date
      ) pay_expenses ON sales.sale_date = pay_expenses.payroll_date
      GROUP BY day;
    `);
    console.log('✓ Daily financial summary view created or replaced');
    
    await queryDatabase(`
      CREATE OR REPLACE VIEW monthly_financial_summary AS
      SELECT 
        DATE_FORMAT(day, '%Y-%m') AS month,
        SUM(total_revenue) AS monthly_revenue,
        SUM(operating_expenses) AS monthly_operating_expenses,
        SUM(payroll_expenses) AS monthly_payroll_expenses,
        SUM(net_profit) AS monthly_net_profit
      FROM daily_financial_summary
      GROUP BY month
      ORDER BY month;
    `);
    console.log('✓ Monthly financial summary view created or replaced');
    
    // Add pieces_per_package column if it doesn't exist
    const columns = await queryDatabase(`
      SHOW COLUMNS FROM products
    `);
    if (!columns.some(col => col.Field === "pieces_per_package")) {
      await queryDatabase(`
        ALTER TABLE products
        ADD COLUMN pieces_per_package INT NULL COMMENT 'Number of pieces per package for packaged products'
      `);
      console.log("Added pieces_per_package column to products table");
    }
    
    // Run financial migrations
    const financialMigrationResult = await runFinancialMigrations(client);
    if (!financialMigrationResult.success) {
      console.error('Error running financial migrations:', financialMigrationResult.error);
      // Continue with other migrations but log the error
    }
    
    // Add daily_economy table
    await queryDatabase(`
      CREATE TABLE IF NOT EXISTS daily_economy (
        id INT AUTO_INCREMENT PRIMARY KEY,
        record_date DATE NOT NULL,
        total_income DECIMAL(10, 2) NOT NULL DEFAULT 0,
        gross_profit DECIMAL(10, 2) NOT NULL DEFAULT 0,
        payroll_expenses DECIMAL(10, 2) NOT NULL DEFAULT 0,
        operating_expenses DECIMAL(10, 2) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_record_date (record_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✓ Daily economy table created');
    
    console.log('✓ Database schema migrations completed successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Database migration error:', error);
    return { success: false, error };
  }
}

module.exports = runMigrations; 