import React, { useState, useEffect } from 'react';
import { Form, Input, Button, InputNumber, Select, Spin } from 'antd';
import styles from './RecipeModal.module.css';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { convertUnits } from '../../../../utils/unitConverter';
import Modal from '../../../../common/components/Modal/Modal';

const { Option } = Select;

const RecipeModal = ({
  isOpen,
  onClose,
  onSave,
  initialValues,
  products,
  isLoading,
  title: modalTitle,
}) => {
  const [form] = Form.useForm();
  const [ingredients, setIngredients] = useState([]);
  const [costPrice, setCostPrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [profit, setProfit] = useState(0);
  const [margin, setMargin] = useState(0);

  // Initialize form with initial values
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        name: initialValues.name,
        sellingPrice: initialValues.sellingPrice,
        recipe: initialValues.recipe || '',
      });
      
      // Set ingredients from initial values
      if (initialValues.ingredients && initialValues.ingredients.length > 0) {
        setIngredients(initialValues.ingredients);
      } else {
        setIngredients([{ id: Date.now(), product: null, amount: null, unit: 'ml' }]);
      }
      
      setSellingPrice(initialValues.sellingPrice || 0);
    } else {
      // Reset form for new recipe
      form.resetFields();
      setIngredients([{ id: Date.now(), product: null, amount: null, unit: 'ml' }]);
      setSellingPrice(0);
    }
  }, [form, initialValues, isOpen]);

  // Calculate cost price and profit whenever ingredients or selling price changes
  useEffect(() => {
    let totalCost = 0;
    
    ingredients.forEach(ing => {
      if (ing.product && ing.amount && ing.unit) {
        const selectedProduct = products.find(p => p._id === ing.product);
        
        if (selectedProduct) {
          // Convert amount to the product's unit for calculation
          const convertedAmount = convertUnits(ing.amount, ing.unit, selectedProduct.unit);
          const ingredientCost = (convertedAmount / selectedProduct.amount) * selectedProduct.price;
          totalCost += ingredientCost;
        }
      }
    });
    
    setCostPrice(totalCost);
    
    // Calculate profit and margin
    const calculatedProfit = sellingPrice - totalCost;
    setProfit(calculatedProfit);
    
    // Calculate margin (profit percentage)
    if (sellingPrice > 0) {
      const calculatedMargin = (calculatedProfit / sellingPrice) * 100;
      setMargin(calculatedMargin);
    } else {
      setMargin(0);
    }
  }, [ingredients, sellingPrice, products]);

  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: Date.now(), product: null, amount: null, unit: 'ml' }
    ]);
  };

  const handleRemoveIngredient = (id) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const handleIngredientChange = (id, field, value) => {
    setIngredients(
      ingredients.map(ing => 
        ing.id === id ? { ...ing, [field]: value } : ing
      )
    );
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Filter out incomplete ingredients
      const validIngredients = ingredients.filter(
        ing => ing.product && ing.amount && ing.unit
      );
      
      if (validIngredients.length === 0) {
        // Validate that there's at least one ingredient
        throw new Error('At least one complete ingredient is required');
      }
      
      onSave({
        ...values,
        ingredients: validIngredients,
        costPrice,
        profit,
        margin,
        id: initialValues?._id
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const title = modalTitle || (initialValues ? 'Edit Recipe' : 'Add New Recipe');

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={title}
      className={styles.recipeModal}
    >
      <Spin spinning={isLoading}>
        <Form
          form={form}
          layout="vertical"
          className={styles.recipeForm}
        >
          <Form.Item
            name="name"
            label="Recipe Name"
            rules={[{ required: true, message: 'Please enter recipe name' }]}
          >
            <Input placeholder="Enter recipe name" />
          </Form.Item>
          
          <div className={styles.costSection}>
            <Form.Item
              name="sellingPrice"
              label="Selling Price"
              rules={[{ required: true, message: 'Please enter selling price' }]}
            >
              <InputNumber
                min={0}
                step={0.1}
                precision={2}
                onChange={value => setSellingPrice(value || 0)}
                addonAfter="€"
                style={{ width: '100%' }}
              />
            </Form.Item>
            
            <div className={styles.statistics}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Cost</span>
                <span className={styles.statValue}>{costPrice.toFixed(2)}€</span>
              </div>
              
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Profit</span>
                <span className={`${styles.statValue} ${profit >= 0 ? styles.positive : styles.negative}`}>
                  {profit.toFixed(2)}€
                </span>
              </div>
              
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Margin</span>
                <span className={`${styles.statValue} ${margin >= 0 ? styles.positive : styles.negative}`}>
                  {margin.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
          
          <Form.Item
            name="recipe"
            label="Recipe Instructions"
          >
            <Input.TextArea
              placeholder="Enter recipe instructions"
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
          </Form.Item>
          
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ marginBottom: '16px' }}>Ingredients</h3>
            
            {ingredients.map((ingredient, index) => (
              <div key={ingredient.id} style={{ marginBottom: '8px' }}>
                <div className={styles.ingredientRow}>
                  <Select
                    className={styles.productSelect}
                    placeholder="Select product"
                    value={ingredient.product}
                    onChange={value => handleIngredientChange(ingredient.id, 'product', value)}
                  >
                    {products.map(product => (
                      <Option key={product._id} value={product._id}>
                        {product.name}
                      </Option>
                    ))}
                  </Select>
                  
                  <InputNumber
                    className={styles.amountInput}
                    min={0.1}
                    step={0.1}
                    precision={2}
                    placeholder="Amount"
                    value={ingredient.amount}
                    onChange={value => handleIngredientChange(ingredient.id, 'amount', value)}
                  />
                  
                  <Select
                    className={styles.unitSelect}
                    value={ingredient.unit}
                    onChange={value => handleIngredientChange(ingredient.id, 'unit', value)}
                  >
                    <Option value="ml">ml</Option>
                    <Option value="cl">cl</Option>
                    <Option value="l">l</Option>
                    <Option value="g">g</Option>
                    <Option value="kg">kg</Option>
                    <Option value="pcs">pcs</Option>
                  </Select>
                  
                  {ingredients.length > 1 && (
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveIngredient(ingredient.id)}
                    />
                  )}
                </div>
              </div>
            ))}
            
            <Button 
              type="dashed" 
              onClick={handleAddIngredient} 
              icon={<PlusOutlined />}
              style={{ width: '100%', marginTop: '8px' }}
            >
              Add Ingredient
            </Button>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button onClick={onClose} style={{ marginRight: '8px' }}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleSubmit}>
              Save Recipe
            </Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default RecipeModal; 