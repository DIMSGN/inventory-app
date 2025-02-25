import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const exportOrderRequirements = (products, rules) => {
    if (!Array.isArray(products)) {
        console.error("Expected an array of products");
        return;
    }

    const doc = new jsPDF();
    doc.setFont("Arial");
    doc.text('Order Requirements', 14, 16);

    const orderRequirements = products.map(product => {
        const greenRule = rules.find(rule => rule.product_id === product.product_id && rule.color === '#00ff00');
        const amountNeeded = greenRule ? greenRule.amount - product.amount : 0;
        return {
            product_id: product.product_id,
            product_name: product.product_name,
            current_amount: product.amount,
            amount_needed: amountNeeded > 0 ? amountNeeded : 0, // Ensure no negative values
            unit: product.unit,
            category: product.category
        };
    });

    doc.autoTable({
        startY: 20,
        head: [['Product ID', 'Name', 'Current Amount', 'Amount Needed', 'Unit', 'Category']],
        body: orderRequirements.map(item => [
            item.product_id,
            item.product_name,
            item.current_amount,
            item.amount_needed,
            item.unit,
            item.category
        ]),
        theme: 'striped',
        headStyles: { fillColor: [22, 160, 133] },
        styles: { cellPadding: 2, fontSize: 10 },
    });

    doc.save('order_requirements.pdf');
};

export default exportOrderRequirements;