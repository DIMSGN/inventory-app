import React from "react";
import styles from "./ProductTableRow.module.css";
import Button from "../../../../../common/components/Button";
import { Link } from "react-router-dom";
import moment from 'moment';
import { formatCurrency, calculateUnitPrice } from "../../../utils/unitConversion";

const ProductTableRow = ({ 
    product, 
    ruleColor, 
    isExpired, 
    isExpiring, 
    onEditProduct, 
    onDeleteProduct
}) => {
    // Format expiration date
    const formatDate = (dateString) => {
        if (!dateString) return 'n/a';
        return moment(dateString).format('MMM D, YYYY');
    };
    
    // Calculate row styling based on rules and expiration
    const getRowStyle = () => {
        if (isExpired) {
            return { backgroundColor: '#ffcccc' }; // Light red for expired
        }
        if (isExpiring) {
            return { backgroundColor: '#fff0cc' }; // Light yellow for expiring soon
        }
        if (ruleColor) {
            return { backgroundColor: ruleColor };
        }
        return {};
    };

    // Calculate unit price
    const getUnitPrice = () => {
        if (!product.purchase_price || !product.amount) return '-';
        
        if (product.pieces_per_package) {
            const pricePerPiece = product.purchase_price / product.pieces_per_package;
            return `${formatCurrency(pricePerPiece)} / piece`;
        }
        
        return calculateUnitPrice(
            product.purchase_price, 
            product.amount, 
            product.unit_name
        ).display;
    };

    // Get package information if available
    const getPackageInfo = () => {
        if (!product.pieces_per_package) return null;
        return `(${product.pieces_per_package} pcs/pkg)`;
    };

    return (
        <tr className={styles.productRow} style={getRowStyle()}>
            <td className={styles.idCell}>#{product.product_id}</td>
            <td className={styles.nameCell}>{product.product_name}</td>
            <td>{product.category_name || product.category}</td>
            <td className={styles.amountCell}>
                {product.amount}
                {product.unit_name && ` ${product.unit_name}`}
                {getPackageInfo()}
            </td>
            <td>{formatCurrency(product.price)}</td>
            <td>{formatCurrency(product.purchase_price)}</td>
            <td className={styles.unitPriceCell}>{getUnitPrice()}</td>
            <td>{formatDate(product.received_date)}</td>
            <td className={isExpired ? styles.expired : isExpiring ? styles.expiring : ''}>
                {formatDate(product.expiration_date)}
                {isExpired && <span className={styles.expiryTag}>Expired</span>}
                {isExpiring && <span className={styles.expiryTag}>Expiring Soon</span>}
            </td>
            <td className={styles.actionsCell}>
                <div className={styles.actionButtons}>
                    <Button
                        onClick={onEditProduct}
                        variant="primary"
                        size="small"
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={onDeleteProduct}
                        variant="danger"
                        size="small"
                    >
                        Delete
                    </Button>
                    <Link to={`/inventory/rules?product=${product.product_id}`}>
                        <Button
                            variant="secondary"
                            size="small"
                        >
                            Rules
                        </Button>
                    </Link>
                </div>
            </td>
        </tr>
    );
};

export default ProductTableRow;
