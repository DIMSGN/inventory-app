import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, InputNumber, Row, Col, Card, message, Divider, Space, Typography, Statistic } from 'antd';
import { PlusOutlined, MinusCircleOutlined, ArrowLeftOutlined, CalculatorOutlined } from '@ant-design/icons';
import { useNavigate, useParams, Link } from 'react-router-dom';
import apiServices from '../../../../common/services/apiServices';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

// Recipe types
const RECIPE_TYPES = {
  FOOD: 'food',
  COFFEE: 'coffee',
  COCKTAIL: 'cocktail'
};

const RecipeForm = ({ onFinish }) => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [recipe, setRecipe] = useState(null);
  const [products, setProducts] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [profit, setProfit] = useState(0);
  const [profitMargin, setprofitMargin] = useState(0);

  useEffect(() => {
    fetchProducts();
    fetchUnits();
    if (recipeId) {
      fetchRecipe(recipeId);
    }
  }, [recipeId]);

  // Calculate costs when ingredients or price changes
  useEffect(() => {
    calculateCosts();
  }, [form.getFieldValue('ingredients'), form.getFieldValue('sale_price')]);

  const fetchProducts = async () => {
    try {
      const response = await apiServices.productService.getProducts();
      setProducts(response.data);
    } catch (error) {
      message.error('Failed to fetch products');
    }
  };

  const fetchUnits = async () => {
    try {
      const response = await apiServices.getUnits();
      setUnits(response.data);
    } catch (error) {
      message.error('Failed to fetch units');
    }
  };

  const fetchRecipe = async (id) => {
    setLoading(true);
    try {
      const response = await apiServices.recipeService.getRecipeById(id);
      const recipeData = response.data;
      setRecipe(recipeData);
      
      // Format the data for the form
      const formattedData = {
        ...recipeData,
        type: recipeData.type || RECIPE_TYPES.FOOD,
        ingredients: recipeData.ingredients.map(ing => ({
          product_id: ing.product_id,
          amount: ing.amount || ing.quantity,
          unit_id: ing.unit_id
        }))
      };
      
      form.setFieldsValue(formattedData);
      calculateCosts();
    } catch (error) {
      message.error('Failed to fetch recipe details');
    } finally {
      setLoading(false);
    }
  };

  const calculateCosts = () => {
    const ingredients = form.getFieldValue('ingredients') || [];
    const salePrice = form.getFieldValue('sale_price') || 0;
    
    let cost = 0;
    
    ingredients.forEach(ingredient => {
      if (ingredient && ingredient.product_id && ingredient.amount) {
        const product = products.find(p => p.id === ingredient.product_id);
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
      setprofitMargin((calculatedProfit / salePrice) * 100);
    } else {
      setprofitMargin(0);
    }
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      // Prepare data for API submission
      const recipeData = {
        ...values,
        // Ensure we use the correct field names expected by the API
        name: values.name,
        type: values.type,
        sale_price: values.sale_price,
        description: values.description || '',
        instructions: values.instructions || '',
        ingredients: values.ingredients.map(ing => ({
          product_id: ing.product_id,
          amount: ing.amount, // Use amount as expected by backend
          unit_id: ing.unit_id
        }))
      };

      if (recipeId) {
        await apiServices.recipeService.updateRecipe(recipeId, recipeData);
        message.success('Recipe updated successfully');
      } else {
        await apiServices.recipeService.createRecipe(recipeData);
        message.success('Recipe created successfully');
        form.resetFields();
      }
      if (onFinish) {
        onFinish();
      } else {
        navigate('/recipes');
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
      message.error('Failed to save recipe: ' + (error.response?.data?.error || error.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card 
      loading={loading} 
      title={
        <Space>
          {recipeId ? 'Edit Recipe' : 'Create New Recipe'}
          {onFinish && (
            <Link to="/recipes">
              <Button icon={<ArrowLeftOutlined />}>Back to Recipes</Button>
            </Link>
          )}
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          name: '',
          description: '',
          sale_price: 0,
          type: RECIPE_TYPES.FOOD,
          instructions: '',
          ingredients: [{ product_id: undefined, amount: 0, unit_id: undefined }]
        }}
      >
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item
              name="name"
              label="Recipe Name"
              rules={[{ required: true, message: 'Please enter recipe name' }]}
            >
              <Input placeholder="Enter recipe name" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="type"
              label="Recipe Type"
              rules={[{ required: true, message: 'Please select a recipe type' }]}
            >
              <Select placeholder="Select type">
                <Option value={RECIPE_TYPES.FOOD}>Food</Option>
                <Option value={RECIPE_TYPES.COFFEE}>Coffee/Beverage</Option>
                <Option value={RECIPE_TYPES.COCKTAIL}>Cocktail</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="sale_price"
              label="Sale Price"
              rules={[{ required: true, message: 'Please enter price' }]}
            >
              <InputNumber
                min={0}
                step={0.01}
                style={{ width: '100%' }}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="Total Cost"
                  value={totalCost}
                  precision={2}
                  prefix="$"
                  suffix=""
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Profit"
                  value={profit}
                  precision={2}
                  prefix="$"
                  valueStyle={{ color: profit >= 0 ? '#3f8600' : '#cf1322' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Profit Margin"
                  value={profitMargin}
                  precision={2}
                  suffix="%"
                  valueStyle={{ color: profitMargin >= 20 ? '#3f8600' : '#cf1322' }}
                />
              </Col>
            </Row>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="Description"
        >
          <TextArea rows={3} placeholder="Enter recipe description" />
        </Form.Item>

        <Form.Item
          name="instructions"
          label="Preparation Instructions"
        >
          <TextArea rows={4} placeholder="Enter preparation instructions" />
        </Form.Item>

        <Divider>Ingredients</Divider>

        <Form.List name="ingredients">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row key={key} gutter={16} style={{ marginBottom: 16 }}>
                  <Col span={10}>
                    <Form.Item
                      {...restField}
                      name={[name, 'product_id']}
                      rules={[{ required: true, message: 'Select a product' }]}
                    >
                      <Select placeholder="Select product">
                        {products.map(product => (
                          <Option key={product.id} value={product.id}>
                            {product.name} (${product.purchase_price || 0} / {product.unit_name})
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      {...restField}
                      name={[name, 'amount']}
                      rules={[{ required: true, message: 'Enter quantity' }]}
                    >
                      <InputNumber
                        min={0.01}
                        step={0.01}
                        style={{ width: '100%' }}
                        placeholder="Quantity"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      {...restField}
                      name={[name, 'unit_id']}
                      rules={[{ required: true, message: 'Select a unit' }]}
                    >
                      <Select placeholder="Select unit">
                        {units.map(unit => (
                          <Option key={unit.id} value={unit.id}>
                            {unit.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <Button 
                      type="text" 
                      danger 
                      icon={<MinusCircleOutlined />} 
                      onClick={() => remove(name)}
                      disabled={fields.length === 1}
                    />
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Ingredient
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {recipeId ? 'Update Recipe' : 'Create Recipe'}
            </Button>
            {onFinish ? (
              <Button onClick={onFinish}>
                Cancel
              </Button>
            ) : (
              <Button onClick={() => navigate('/recipes')}>
                Cancel
              </Button>
            )}
            <Button 
              type="default" 
              icon={<CalculatorOutlined />} 
              onClick={calculateCosts}
            >
              Recalculate Costs
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default RecipeForm; 