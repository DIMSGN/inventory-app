import React, { useState } from 'react';
import { Tabs, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './RecipesSection.module.css';
import RecipeCard from '../RecipeCard';
import RecipeModal from '../RecipeModal';
import SearchBar from '../SearchBar';
import { useAppContext } from '../../../../common/contexts/AppContext';

const { TabPane } = Tabs;

// Tab constants
const TABS = {
  COCKTAILS: 'cocktails',
  COFFEE: 'coffee'
};

const RecipesSection = ({
  recipes,
  isLoading,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab
}) => {
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
          type: activeTab
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save recipe:', error);
    }
  };
  
  const getModalTitle = () => {
    const recipeTypeText = activeTab === TABS.COFFEE ? 'Coffee/Beverage' : 'Cocktail';
    return editingRecipe 
      ? `Edit ${recipeTypeText} Recipe` 
      : `Add New ${recipeTypeText} Recipe`;
  };
  
  return (
    <div className={styles.recipesSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Bar Recipes</h2>
        
        <div className={styles.headerActions}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddRecipe}
          >
            Add Recipe
          </Button>
          
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search recipes..."
          />
        </div>
      </div>
      
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        className={styles.tabs}
      >
        <TabPane tab="Cocktails" key={TABS.COCKTAILS}>
          <div className={styles.recipeGrid}>
            {isLoading ? (
              <div className={styles.loading}>Loading recipes...</div>
            ) : recipes.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No cocktail recipes found.</p>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={handleAddRecipe}
                >
                  Create Recipe
                </Button>
              </div>
            ) : (
              recipes.map(recipe => (
                <RecipeCard 
                  key={recipe.recipe_id} 
                  recipe={recipe} 
                  onEdit={() => handleEditRecipe(recipe)}
                />
              ))
            )}
          </div>
        </TabPane>
        
        <TabPane tab="Coffee & Beverages" key={TABS.COFFEE}>
          <div className={styles.recipeGrid}>
            {isLoading ? (
              <div className={styles.loading}>Loading recipes...</div>
            ) : recipes.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No coffee or beverage recipes found.</p>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={handleAddRecipe}
                >
                  Create Recipe
                </Button>
              </div>
            ) : (
              recipes.map(recipe => (
                <RecipeCard 
                  key={recipe.recipe_id} 
                  recipe={recipe} 
                  onEdit={() => handleEditRecipe(recipe)}
                />
              ))
            )}
          </div>
        </TabPane>
      </Tabs>
      
      <RecipeModal
        isOpen={isModalVisible}
        onClose={handleCloseModal}
        onSave={handleSaveRecipe}
        initialValues={editingRecipe}
        products={products || []}
        isLoading={isLoading}
        title={getModalTitle()}
      />
    </div>
  );
};

export default RecipesSection; 