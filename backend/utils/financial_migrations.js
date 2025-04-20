/**
 * Financial tables migration script
 * This script creates or updates financial-related tables in the database
 */

const runFinancialMigrations = async (client) => {
  try {
    console.log('Running financial migrations...');
    
    // Create financial_sales table
    await client.query(`
      CREATE TABLE IF NOT EXISTS financial_sales (
        id VARCHAR(36) PRIMARY KEY,
        year INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        january DECIMAL(12,2) DEFAULT 0,
        february DECIMAL(12,2) DEFAULT 0,
        march DECIMAL(12,2) DEFAULT 0,
        april DECIMAL(12,2) DEFAULT 0,
        may DECIMAL(12,2) DEFAULT 0,
        june DECIMAL(12,2) DEFAULT 0,
        july DECIMAL(12,2) DEFAULT 0,
        august DECIMAL(12,2) DEFAULT 0,
        september DECIMAL(12,2) DEFAULT 0,
        october DECIMAL(12,2) DEFAULT 0,
        november DECIMAL(12,2) DEFAULT 0,
        december DECIMAL(12,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(year, name)
      )
    `);
    
    // Create financial_cost_of_goods table
    await client.query(`
      CREATE TABLE IF NOT EXISTS financial_cost_of_goods (
        id VARCHAR(36) PRIMARY KEY,
        year INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        january DECIMAL(12,2) DEFAULT 0,
        february DECIMAL(12,2) DEFAULT 0,
        march DECIMAL(12,2) DEFAULT 0,
        april DECIMAL(12,2) DEFAULT 0,
        may DECIMAL(12,2) DEFAULT 0,
        june DECIMAL(12,2) DEFAULT 0,
        july DECIMAL(12,2) DEFAULT 0,
        august DECIMAL(12,2) DEFAULT 0,
        september DECIMAL(12,2) DEFAULT 0,
        october DECIMAL(12,2) DEFAULT 0,
        november DECIMAL(12,2) DEFAULT 0,
        december DECIMAL(12,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(year, name)
      )
    `);
    
    // Create financial_operational_expenses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS financial_operational_expenses (
        id VARCHAR(36) PRIMARY KEY,
        year INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        january DECIMAL(12,2) DEFAULT 0,
        february DECIMAL(12,2) DEFAULT 0,
        march DECIMAL(12,2) DEFAULT 0,
        april DECIMAL(12,2) DEFAULT 0,
        may DECIMAL(12,2) DEFAULT 0,
        june DECIMAL(12,2) DEFAULT 0,
        july DECIMAL(12,2) DEFAULT 0,
        august DECIMAL(12,2) DEFAULT 0,
        september DECIMAL(12,2) DEFAULT 0,
        october DECIMAL(12,2) DEFAULT 0,
        november DECIMAL(12,2) DEFAULT 0,
        december DECIMAL(12,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(year, name)
      )
    `);
    
    // Create financial_utilities_expenses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS financial_utilities_expenses (
        id VARCHAR(36) PRIMARY KEY,
        year INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        january DECIMAL(12,2) DEFAULT 0,
        february DECIMAL(12,2) DEFAULT 0,
        march DECIMAL(12,2) DEFAULT 0,
        april DECIMAL(12,2) DEFAULT 0,
        may DECIMAL(12,2) DEFAULT 0,
        june DECIMAL(12,2) DEFAULT 0,
        july DECIMAL(12,2) DEFAULT 0,
        august DECIMAL(12,2) DEFAULT 0,
        september DECIMAL(12,2) DEFAULT 0,
        october DECIMAL(12,2) DEFAULT 0,
        november DECIMAL(12,2) DEFAULT 0,
        december DECIMAL(12,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(year, name)
      )
    `);
    
    // Create financial_summary table for storing calculated summaries
    await client.query(`
      CREATE TABLE IF NOT EXISTS financial_summary (
        year INT PRIMARY KEY,
        summary_data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create operating_expenses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS operating_expenses (
        id SERIAL PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        amount DECIMAL(12,2) NOT NULL,
        expense_date DATE NOT NULL,
        payment_method VARCHAR(50),
        receipt_file VARCHAR(255),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Operating expenses table created or verified');
    
    // Create payroll_expenses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS payroll_expenses (
        id SERIAL PRIMARY KEY,
        employee_name VARCHAR(100) NOT NULL,
        position VARCHAR(100),
        amount DECIMAL(12,2) NOT NULL,
        payment_date DATE NOT NULL,
        payment_method VARCHAR(50),
        hours_worked DECIMAL(10,2),
        hourly_rate DECIMAL(10,2),
        tax_amount DECIMAL(10,2),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Payroll expenses table created or verified');
    
    // Create monthly_financial_summaries table for storing calculated monthly summaries
    await client.query(`
      CREATE TABLE IF NOT EXISTS monthly_financial_summaries (
        id SERIAL PRIMARY KEY,
        year INT NOT NULL,
        month INT NOT NULL,
        total_revenue DECIMAL(12,2) DEFAULT 0,
        revenue_breakdown JSONB DEFAULT '{}',
        operating_expenses DECIMAL(12,2) DEFAULT 0,
        operating_expense_breakdown JSONB DEFAULT '{}',
        payroll_expenses DECIMAL(12,2) DEFAULT 0,
        payroll_expense_breakdown JSONB DEFAULT '{}',
        net_profit DECIMAL(12,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(year, month)
      )
    `);
    console.log('Monthly financial summaries table created or verified');
    
    // Create daily_economy_logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS daily_economy_logs (
        id SERIAL PRIMARY KEY,
        log_date DATE NOT NULL UNIQUE,
        total_sales DECIMAL(12,2) DEFAULT 0,
        sales_breakdown JSONB DEFAULT '{}',
        operating_expenses DECIMAL(12,2) DEFAULT 0,
        operating_expense_breakdown JSONB DEFAULT '{}',
        payroll_expenses DECIMAL(12,2) DEFAULT 0,
        payroll_expense_breakdown JSONB DEFAULT '{}',
        net_profit DECIMAL(12,2) DEFAULT 0,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Daily economy logs table created or verified');
    
    // Create index for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_financial_sales_year ON financial_sales(year);
      CREATE INDEX IF NOT EXISTS idx_financial_cost_of_goods_year ON financial_cost_of_goods(year);
      CREATE INDEX IF NOT EXISTS idx_financial_operational_expenses_year ON financial_operational_expenses(year);
      CREATE INDEX IF NOT EXISTS idx_financial_utilities_expenses_year ON financial_utilities_expenses(year);
    `);
    
    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_operating_expenses_date ON operating_expenses(expense_date);
      CREATE INDEX IF NOT EXISTS idx_operating_expenses_category ON operating_expenses(category);
      CREATE INDEX IF NOT EXISTS idx_payroll_expenses_date ON payroll_expenses(payment_date);
      CREATE INDEX IF NOT EXISTS idx_payroll_expenses_employee ON payroll_expenses(employee_name);
      CREATE INDEX IF NOT EXISTS idx_payroll_expenses_position ON payroll_expenses(position);
      CREATE INDEX IF NOT EXISTS idx_monthly_financial_summaries_year_month ON monthly_financial_summaries(year, month);
    `);
    
    // Create index for better performance on daily economy logs
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_daily_economy_logs_date ON daily_economy_logs(log_date);
    `);
    
    // Add some default data for testing if no data exists
    const currentYear = new Date().getFullYear();
    
    // Check if data exists
    const checkResult = await client.query(`
      SELECT COUNT(*) as count FROM financial_sales WHERE year = $1
    `, [currentYear]);
    
    if (parseInt(checkResult.rows[0].count) === 0) {
      console.log('Adding sample financial data for testing...');
      
      // Add sample sales data
      await client.query(`
        INSERT INTO financial_sales (id, year, name, category, january, february, march)
        VALUES 
        (uuid_generate_v4(), $1, 'Food Sales', 'Food', 12500, 13200, 14100),
        (uuid_generate_v4(), $1, 'Beverage Sales', 'Beverage', 8300, 8500, 9200),
        (uuid_generate_v4(), $1, 'Alcohol Sales', 'Alcohol', 7400, 7800, 8600)
      `, [currentYear]);
      
      // Add sample cost of goods data
      await client.query(`
        INSERT INTO financial_cost_of_goods (id, year, name, category, january, february, march)
        VALUES 
        (uuid_generate_v4(), $1, 'Food Costs', 'Food', 4500, 4700, 5100),
        (uuid_generate_v4(), $1, 'Beverage Costs', 'Beverage', 2100, 2200, 2400),
        (uuid_generate_v4(), $1, 'Alcohol Costs', 'Alcohol', 2900, 3200, 3400)
      `, [currentYear]);
      
      // Add sample operational expenses data
      await client.query(`
        INSERT INTO financial_operational_expenses (id, year, name, category, january, february, march)
        VALUES 
        (uuid_generate_v4(), $1, 'Staff Salaries', 'Labor', 8500, 8500, 8500),
        (uuid_generate_v4(), $1, 'Marketing', 'Promotion', 1500, 1800, 1300),
        (uuid_generate_v4(), $1, 'Maintenance', 'Operations', 800, 1200, 600)
      `, [currentYear]);
      
      // Add sample utilities expenses data
      await client.query(`
        INSERT INTO financial_utilities_expenses (id, year, name, category, january, february, march)
        VALUES 
        (uuid_generate_v4(), $1, 'Rent', 'Facilities', 3500, 3500, 3500),
        (uuid_generate_v4(), $1, 'Electricity', 'Utilities', 1200, 1150, 1300),
        (uuid_generate_v4(), $1, 'Water', 'Utilities', 450, 480, 490)
      `, [currentYear]);
    }
    
    // Add some default data for operating and payroll expenses if no data exists
    const checkOperatingExpenses = await client.query(`
      SELECT COUNT(*) as count FROM operating_expenses
    `);
    
    if (parseInt(checkOperatingExpenses.rows[0].count) === 0) {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      
      // Add sample operating expenses data
      await client.query(`
        INSERT INTO operating_expenses 
          (category, description, amount, expense_date, payment_method, notes)
        VALUES 
          ('Rent', 'Monthly rent payment', 2500.00, $1, 'Bank Transfer', 'Regular monthly payment'),
          ('Utilities', 'Electricity bill', 450.00, $2, 'Credit Card', 'Higher than usual due to AC usage'),
          ('Supplies', 'Office supplies', 120.50, $3, 'Cash', 'Paper, pens, and other office items'),
          ('Marketing', 'Social media ads', 350.00, $4, 'Credit Card', 'Facebook and Instagram campaign'),
          ('Maintenance', 'Plumbing repairs', 275.00, $5, 'Check', 'Emergency repair in the bathroom')
      `, [
        new Date(currentYear, currentMonth, 1),
        new Date(currentYear, currentMonth, 5),
        new Date(currentYear, currentMonth, 10),
        new Date(currentYear, currentMonth, 15),
        new Date(currentYear, currentMonth, 20)
      ]);
      console.log('Added sample operating expenses data');
    }
    
    const checkPayrollExpenses = await client.query(`
      SELECT COUNT(*) as count FROM payroll_expenses
    `);
    
    if (parseInt(checkPayrollExpenses.rows[0].count) === 0) {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      
      // Add sample payroll expenses data
      await client.query(`
        INSERT INTO payroll_expenses 
          (employee_name, position, amount, payment_date, payment_method, hours_worked, hourly_rate)
        VALUES 
          ('John Smith', 'Manager', 3200.00, $1, 'Direct Deposit', 160, 20.00),
          ('Maria Garcia', 'Chef', 2800.00, $2, 'Direct Deposit', 168, 16.67),
          ('David Lee', 'Bartender', 1900.00, $3, 'Direct Deposit', 140, 13.57),
          ('Sarah Johnson', 'Server', 1700.00, $4, 'Direct Deposit', 130, 13.08),
          ('Michael Brown', 'Dishwasher', 1400.00, $5, 'Check', 120, 11.67)
      `, [
        new Date(currentYear, currentMonth, 1),
        new Date(currentYear, currentMonth, 1),
        new Date(currentYear, currentMonth, 1),
        new Date(currentYear, currentMonth, 1),
        new Date(currentYear, currentMonth, 1)
      ]);
      console.log('Added sample payroll expenses data');
    }
    
    console.log('Financial migrations completed successfully');
    return { success: true };
  } catch (error) {
    console.error('Error running financial migrations:', error);
    return { success: false, error };
  }
};

module.exports = runFinancialMigrations; 