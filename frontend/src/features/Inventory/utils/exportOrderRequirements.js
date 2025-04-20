import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';

/**
 * Export order requirements to PDF based on products and rules
 * @param {Array} products - The products to include
 * @param {Array} rules - The rules to use for determining requirements
 */
const exportOrderRequirements = (products, rules) => {
  // Create a new PDF document in landscape orientation
  const doc = new jsPDF('landscape');
  
  // Add title and date
  const today = moment().format('YYYY-MM-DD');
  doc.setFontSize(16);
  doc.text('Order Requirements', 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on: ${today}`, 14, 22);
  
  // Helper function to get the target amount from a rule
  const getTargetAmount = (product, rules) => {
    // Find green rules (indicating target levels) for this product
    const greenRules = rules.filter(rule => {
      const isGreenish = rule.color.toLowerCase().includes('00ff00') || 
                       rule.color.toLowerCase() === '#00ff00' || 
                       rule.color.toLowerCase() === 'green';
      
      return isGreenish && 
             (rule.product_id === product.product_id || !rule.product_id) &&
             (rule.comparison === '>' || rule.comparison === '>=');
    });
    
    if (greenRules.length === 0) return 'Not specified';
    
    // Use the first matching rule's amount as target
    return greenRules[0].amount;
  };
  
  // Helper to calculate amount needed
  const getAmountNeeded = (product, targetAmount) => {
    if (targetAmount === 'Not specified') return 'N/A';
    
    const currentAmount = Number(product.amount) || 0;
    const target = Number(targetAmount);
    
    return currentAmount >= target ? 0 : target - currentAmount;
  };
  
  // Create data array for the table
  const tableData = products
    .map(product => {
      const targetAmount = getTargetAmount(product, rules);
      const amountNeeded = getAmountNeeded(product, targetAmount);
      
      return [
        product.product_id,
        product.product_name,
        product.amount,
        targetAmount,
        amountNeeded === 'N/A' ? 'N/A' : amountNeeded,
        product.unit_name || 'N/A',
        product.category_name || 'N/A'
      ];
    })
    // Filter products that need ordering (amount needed > 0)
    .filter(row => row[4] !== 'N/A' && row[4] > 0);
  
  // Define table columns
  const columns = [
    'Product ID', 
    'Name', 
    'Current Amount', 
    'Target Amount',
    'Amount Needed',
    'Unit', 
    'Category'
  ];
  
  // Generate the table
  doc.autoTable({
    startY: 30,
    head: [columns],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [46, 125, 50], // Green color
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: {
      lineColor: [221, 221, 221],
      lineWidth: 0.1,
    },
    alternateRowStyles: {
      fillColor: [240, 248, 240] // Light green tint
    }
  });
  
  // Add page number and total count at footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer text
    doc.setFontSize(8);
    doc.text(
      `Page ${i} of ${pageCount} | Total Products To Order: ${tableData.length}`,
      doc.internal.pageSize.width - 20,
      doc.internal.pageSize.height - 10,
      { align: 'right' }
    );
  }
  
  // Save the PDF
  doc.save(`order_requirements_${today}.pdf`);
};

export default exportOrderRequirements; 