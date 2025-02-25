import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const exportToPDF = (products) => {
    const doc = new jsPDF();
    doc.setFont("Arial");
    doc.text('Product Table', 14, 16);
    doc.autoTable({
        startY: 20,
        head: [['Product ID', 'Name', 'Amount', 'Unit', 'Category']],
        body: products.map(product => [
            product.product_id, 
            product.product_name, 
            product.amount, 
            product.unit, 
            product.category
        ]),
        theme: 'striped',
        headStyles: { fillColor: [22, 160, 133] },
        styles: { cellPadding: 2, fontSize: 10 },
    });
    doc.save('products.pdf');
};