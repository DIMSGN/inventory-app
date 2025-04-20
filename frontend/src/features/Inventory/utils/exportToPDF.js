import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';

/**
 * Exports product data to a PDF file
 * @param {Array} products - The list of products to export
 */
export const exportToPDF = (products) => {
  // Create a new PDF document
  const doc = new jsPDF('landscape');
  
  // Add title and date
  const today = moment().format('YYYY-MM-DD');
  doc.setFontSize(16);
  doc.text('Inventory Report', 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on: ${today}`, 14, 22);
  
  // Create data array for the table
  const tableData = products.map(product => [
    product.product_id,
    product.product_name,
    product.category_name || 'N/A',
    `${product.quantity} ${product.unit_name || ''}`,
    `$${product.price ? product.price.toFixed(2) : '0.00'}`,
    `$${product.purchase_price ? product.purchase_price.toFixed(2) : '0.00'}`,
    `$${product.unit_price ? product.unit_price.toFixed(2) : '0.00'}`,
    product.received_date ? moment(product.received_date).format('YYYY-MM-DD') : 'N/A',
    product.expiration_date ? moment(product.expiration_date).format('YYYY-MM-DD') : 'N/A'
  ]);
  
  // Define table columns
  const columns = [
    'ID', 
    'Name', 
    'Category', 
    'Amount', 
    'Price', 
    'Purchase Price', 
    'Unit Price', 
    'Received Date', 
    'Expiration'
  ];
  
  // Generate the table
  doc.autoTable({
    startY: 30,
    head: [columns],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: {
      lineColor: [221, 221, 221],
      lineWidth: 0.1,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    }
  });
  
  // Add page number and total count at footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer text
    doc.setFontSize(8);
    doc.text(
      `Page ${i} of ${pageCount} | Total Products: ${products.length}`,
      doc.internal.pageSize.width - 20,
      doc.internal.pageSize.height - 10,
      { align: 'right' }
    );
  }
  
  // Save the PDF
  doc.save(`inventory_report_${today}.pdf`);
}; 