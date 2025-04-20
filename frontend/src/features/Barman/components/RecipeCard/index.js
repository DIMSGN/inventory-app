import React from 'react';
import { Card, Button, Space, Typography, Tag } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import styles from './RecipeCard.module.css';

const { Title, Text } = Typography;

/**
 * RecipeCard component for displaying individual bar recipe information
 * 
 * @param {Object} props - Component props
 * @param {Object} props.recipe - Recipe data object
 * @param {Function} props.onEdit - Function to handle editing the recipe
 * @returns {JSX.Element} RecipeCard component
 */
const RecipeCard = ({ recipe, onEdit }) => {
  const { recipe_id, name, sale_price, total_cost, type, ingredients = [] } = recipe;
  
  // Calculate profit and margin
  const profit = sale_price - (total_cost || 0);
  const margin = sale_price > 0 ? (profit / sale_price) * 100 : 0;
  
  return (
    <Card
      className={styles.recipeCard}
      actions={[
        <Button 
          type="default" 
          icon={<EyeOutlined />}
          key="view"
        >
          View
        </Button>,
        <Button 
          type="primary" 
          icon={<EditOutlined />} 
          onClick={onEdit}
          key="edit"
        >
          Edit
        </Button>
      ]}
    >
      <div className={styles.recipeHeader}>
        <Title level={4} className={styles.recipeName}>{name}</Title>
        <Tag color={type === 'cocktail' ? 'purple' : 'blue'}>
          {type === 'cocktail' ? 'Cocktail' : 'Coffee/Beverage'}
        </Tag>
      </div>
      
      <div className={styles.recipeStats}>
        <div className={styles.statItem}>
          <Text type="secondary">Sale Price</Text>
          <Text strong>€{sale_price?.toFixed(2) || '0.00'}</Text>
        </div>
        
        <div className={styles.statItem}>
          <Text type="secondary">Cost</Text>
          <Text strong>€{total_cost?.toFixed(2) || '0.00'}</Text>
        </div>
        
        <div className={styles.statItem}>
          <Text type="secondary">Profit</Text>
          <Text 
            strong
            type={profit >= 0 ? 'success' : 'danger'}
          >
            €{profit.toFixed(2)}
          </Text>
        </div>
        
        <div className={styles.statItem}>
          <Text type="secondary">Margin</Text>
          <Text 
            strong
            type={margin >= 0 ? 'success' : 'danger'}
          >
            {margin.toFixed(1)}%
          </Text>
        </div>
      </div>
      
      <div className={styles.recipeDetails}>
        <Text type="secondary">
          {ingredients.length} {ingredients.length === 1 ? 'ingredient' : 'ingredients'}
        </Text>
      </div>
    </Card>
  );
};

export default RecipeCard; 