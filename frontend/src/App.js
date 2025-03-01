import React, { useState, useContext, useEffect } from "react";
import { ProductContext } from "./context/ProductContext";
import Header from "./components/Header/Header";
import ProductTable from "./components/ProductTable/ProductTable";
import AddProductForm from "./components/AddProductForm/AddProductForm"; // Updated import
import EditProductForm from "./components/EditProductForm/EditProductForm";
import useFetch from "./hooks/useFetch";
import styles from "./App.css";

const App = () => {
    const [showProductManager, setShowProductManager] = useState(false);
    const { editingProduct, fetchProducts, categories, products } = useContext(ProductContext);

    return (
        <div className={styles.container}>
            <Header />
            <ProductTable onAddProductClick={() => setShowProductManager(true)} />
            {showProductManager && <AddProductForm onClose={() => setShowProductManager(false)} />} {/* Updated usage */}
            {editingProduct && <EditProductForm />}
        </div>
    );
};

export default App;
