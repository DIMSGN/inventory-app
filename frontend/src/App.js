import React, { useState, useContext } from "react";
import { ProductContext } from "./context/ProductContext";
import Header from "./components/Header/Header";
import ProductTable from "./components/ProductTable/ProductTable";
import RuleManager from "./components/RuleManager/RuleManager";
import RuleList from "./components/RuleList/RuleList";
import ProductManager from "./components/ProductManager/ProductManager";
import EditProductForm from "./components/EditProductForm/EditProductForm";
import styles from "./App.css"; 

const App = () => {
    const [showProductManager, setShowProductManager] = useState(false);
    const { editingProduct } = useContext(ProductContext);

    const handleAddProductClick = () => {
        setShowProductManager(true);
    };

    const handleCloseProductManager = () => {
        setShowProductManager(false);
    };

    return (
        <div className={styles.container}>
            <Header />
            <ProductTable onAddProductClick={handleAddProductClick} />
            {showProductManager && <ProductManager onClose={handleCloseProductManager} />}
            {editingProduct && <EditProductForm />}
            <RuleManager />
            <RuleList />
        </div>
    );
};

export default App;
