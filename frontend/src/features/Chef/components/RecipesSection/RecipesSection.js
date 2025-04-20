/**
 * Recipes section component for food recipes
 * @module components/RecipesSection
 */

import React, { useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import SearchBar from '../SearchBar/SearchBar';
import RecipeList from '../RecipeList/RecipeList';
import RecipeModal from '../RecipeModal/RecipeModal';
import styles from './RecipesSection.module.css';
import { useAppContext } from '../../../../common/contexts/AppContext';
import { useTranslation } from 'react-i18next';

/**
 * RecipesSection component for displaying and filtering food recipes
 * 
 * @param {Object} props - Component props
 * @param {Array} props.recipes - Array of recipe objects
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.searchQuery - Current search query
 * @param {Function} props.setSearchQuery - Function to update search query
 * @returns {JSX.Element} RecipesSection component
 */
const RecipesSection = ({
  recipes,
  isLoading,
  searchQuery,
  setSearchQuery
}) => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const { products, createRecipe, updateRecipe } = useAppContext();
  
  const handleAddRecipe = () => {
    setEditingRecipe(null);
    setIsModalVisible(true);
  };
  
  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setIsModalVisible(true);
  };
  
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingRecipe(null);
  };
  
  const handleSaveRecipe = async (recipeData) => {
    try {
      if (recipeData.id) {
        await updateRecipe(recipeData.id, recipeData);
      } else {
        await createRecipe({
          ...recipeData,
          type: 'food'
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save recipe:', error);
    }
  };
  
  return (
    <div className={styles.recipesSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{t('recipesSection.title')}</h2>
        
        <div className={styles.headerActions}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddRecipe}
          >
            {t('recipeModal.addTitle')}
          </Button>
          
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder={t('recipesSection.searchPlaceholder')}
          />
        </div>
      </div>

      <RecipeList
        recipes={recipes}
        isLoading={isLoading}
        onEditRecipe={handleEditRecipe}
      />
      
      <RecipeModal
        isOpen={isModalVisible}
        onClose={handleCloseModal}
        onSave={handleSaveRecipe}
        initialValues={editingRecipe}
        products={products || []}
        isLoading={isLoading}
        title={editingRecipe ? t('recipeModal.editTitle') : t('recipeModal.addTitle')}
      />
    </div>
  );
};

export default RecipesSection; 