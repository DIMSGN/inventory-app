import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, Card, message, Drawer, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import apiServices from '../../../../common/services/apiServices';
import RecipeForm from './RecipeForm';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const response = await apiServices.recipeService.getRecipes();
      setRecipes(response.data);
    } catch (error) {
      message.error('Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecipe = () => {
    setSelectedRecipeId(null);
    setDrawerVisible(true);
  };

  const handleEditRecipe = (recipeId) => {
    setSelectedRecipeId(recipeId);
    setDrawerVisible(true);
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      await apiServices.recipeService.deleteRecipe(recipeId);
      message.success('Recipe deleted successfully');
      fetchRecipes();
    } catch (error) {
      message.error('Failed to delete recipe');
    }
  };

  const handleFormComplete = () => {
    setDrawerVisible(false);
    fetchRecipes();
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price.toFixed(2)}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Ingredients',
      dataIndex: 'ingredients',
      key: 'ingredients',
      render: (ingredients) => (
        <Space size={[0, 4]} wrap>
          {ingredients && ingredients.map((ingredient, index) => (
            <Tag key={index}>
              {ingredient.product_name}: {ingredient.quantity} {ingredient.unit_name}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditRecipe(record.id)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this recipe?"
            onConfirm={() => handleDeleteRecipe(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title="Recipes"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddRecipe}
          >
            Add Recipe
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={recipes}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Drawer
        title={selectedRecipeId ? "Edit Recipe" : "Add New Recipe"}
        width={720}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <RecipeForm
          recipeId={selectedRecipeId}
          onFinish={handleFormComplete}
        />
      </Drawer>
    </>
  );
};

export default RecipeList; 