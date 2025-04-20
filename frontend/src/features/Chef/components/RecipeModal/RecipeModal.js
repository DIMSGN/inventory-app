import React, { useState, useEffect } from 'react';
import { Form, Input, Select, InputNumber, Button, Space, Divider, Spin } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useAppContext } from '../../../../common/contexts/AppContext';
import styles from './RecipeModal.module.css';
import Modal from '../../../../common/components/Modal/Modal';
import { useTranslation } from 'react-i18next';

const { Option } = Select;
const { TextArea } = Input;

/**
 * RecipeModal component for adding or editing food recipes
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onSave - Function to save the recipe
 * @param {Object} props.initialValues - Recipe being edited (null for new recipe)
 * @param {Array} props.products - Array of available products
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.title - Modal title
 * @returns {JSX.Element} RecipeModal component
 */
const RecipeModal = ({ 
  isOpen, 
  onClose, 
  onSave,
  initialValues = null,
  products = [],
  isLoading = false,
  title
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { units } = useAppContext();
  const [totalCost, setTotalCost] = useState(0);
  const [profit, setProfit] = useState(0);
  const [profitMargin, setProfitMargin] = useState(0);
  
  const isEditing = !!initialValues;
  
  // Set form values when editing
  useEffect(() => {
    if (isOpen && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        // Format ingredients for the form
        ingredients: initialValues.ingredients?.map(ing => ({
          product_id: ing.product_id,
          amount: ing.amount,
          unit_id: ing.unit_id
        })) || []
      });
      calculateCosts();
    } else if (isOpen) {
      // Reset form for new recipe
      form.resetFields();
      form.setFieldsValue({
        type: 'food',
        sale_price: 0,
        ingredients: [{ product_id: undefined, amount: 0, unit_id: undefined }]
      });
      setTotalCost(0);
      setProfit(0);
      setProfitMargin(0);
    }
  }, [isOpen, initialValues, form]);
  
  // Calculate costs when form values change
  useEffect(() => {
    const formValues = form.getFieldsValue();
    calculateCosts(formValues);
  }, [form.getFieldValue('ingredients'), form.getFieldValue('sale_price')]);
  
  const calculateCosts = (values = form.getFieldsValue()) => {
    const ingredients = values.ingredients || [];
    const salePrice = values.sale_price || 0;
    
    let cost = 0;
    
    ingredients.forEach(ingredient => {
      if (ingredient && ingredient.product_id && ingredient.amount) {
        const product = products.find(p => p.product_id === ingredient.product_id);
        if (product) {
          const unitPrice = product.purchase_price || 0;
          cost += unitPrice * ingredient.amount;
        }
      }
    });
    
    setTotalCost(cost);
    const calculatedProfit = salePrice - cost;
    setProfit(calculatedProfit);
    
    if (salePrice > 0) {
      setProfitMargin((calculatedProfit / salePrice) * 100);
    } else {
      setProfitMargin(0);
    }
  };
  
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // Prepare data for API submission
      const recipeData = {
        ...values,
        type: 'food', // Hard-coded for Chef section
        ingredients: values.ingredients.map(ing => ({
          product_id: ing.product_id,
          amount: ing.amount,
          unit_id: ing.unit_id
        }))
      };
      
      onSave({
        ...recipeData,
        id: initialValues?._id || initialValues?.id
      });
    } catch (error) {
      console.error('Failed to save recipe:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const modalTitle = title || (isEditing ? t('recipeModal.editTitle') : t('recipeModal.addTitle'));
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      className={styles.recipeModal}
    >
      <Spin spinning={isLoading || loading}>
        <Form
          form={form}
          layout="vertical"
          className={styles.recipeForm}
        >
          <Form.Item
            name="name"
            label={t('recipeModal.nameLabel')}
            rules={[{ required: true, message: 'Please enter recipe name' }]}
          >
            <Input placeholder={t('recipeModal.namePlaceholder')} />
          </Form.Item>
          
          <div className={styles.costSection}>
            <Form.Item
              name="sale_price"
              label={t('recipeModal.salePriceLabel')}
              rules={[{ required: true, message: 'Please enter price' }]}
            >
              <InputNumber
                min={0}
                step={0.01}
                style={{ width: '100%' }}
                formatter={value => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/€\s?|(,*)/g, '')}
                onChange={value => form.setFieldsValue({ sale_price: value })}
              />
            </Form.Item>
            
            <div className={styles.statistics}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>{t('recipeModal.totalCost')}:</span>
                <span className={styles.statValue}>€ {totalCost.toFixed(2)}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>{t('recipeModal.profit')}:</span>
                <span className={`${styles.statValue} ${profit >= 0 ? styles.positive : styles.negative}`}>
                  € {profit.toFixed(2)}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>{t('recipeModal.profitMargin')}:</span>
                <span className={`${styles.statValue} ${profitMargin >= 0 ? styles.positive : styles.negative}`}>
                  {profitMargin.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
          
          <Form.Item
            name="description"
            label={t('recipeModal.descriptionLabel')}
          >
            <TextArea 
              rows={2} 
              placeholder={t('recipeModal.descriptionPlaceholder')} 
            />
          </Form.Item>
          
          <Form.Item
            name="instructions"
            label={t('recipeModal.preparationLabel')}
          >
            <TextArea 
              rows={4} 
              placeholder={t('recipeModal.preparationPlaceholder')} 
            />
          </Form.Item>
          
          <Divider orientation="left">{t('recipeModal.ingredientsTitle')}</Divider>
          
          <Form.List name="ingredients">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space 
                    key={key} 
                    style={{ display: 'flex', marginBottom: 8 }} 
                    align="baseline"
                    className={styles.ingredientRow}
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'product_id']}
                      rules={[{ required: true, message: 'Select product' }]}
                      className={styles.productSelect}
                    >
                      <Select placeholder={t('recipeModal.ingredientLabel')}>
                        {products.map(product => (
                          <Option key={product.product_id} value={product.product_id}>
                            {product.product_name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    
                    <Form.Item
                      {...restField}
                      name={[name, 'amount']}
                      rules={[{ required: true, message: 'Amount required' }]}
                      className={styles.amountInput}
                    >
                      <InputNumber min={0} placeholder={t('recipeModal.amountLabel')} />
                    </Form.Item>
                    
                    <Form.Item
                      {...restField}
                      name={[name, 'unit_id']}
                      rules={[{ required: true, message: 'Select unit' }]}
                      className={styles.unitSelect}
                    >
                      <Select placeholder={t('recipeModal.unitLabel')}>
                        {units.map(unit => (
                          <Option key={unit.id} value={unit.id}>
                            {unit.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                
                <Form.Item>
                  <Button 
                    type="dashed" 
                    onClick={() => add()} 
                    block 
                    icon={<PlusOutlined />}
                  >
                    {t('recipeModal.addIngredient')}
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          
          <div className={styles.modalFooter}>
            <Button onClick={onClose}>{t('recipeModal.cancel')}</Button>
            <Button type="primary" onClick={handleSubmit}>
              {t('recipeModal.save')}
            </Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default RecipeModal; 