import React from 'react';
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { DatePickerField } from '../../../../../../../common/components';
import useSalesForm from '../../hooks/useSalesForm';

const INITIAL_STATE = {
  recipe_id: '',
  quantity: 1,
  sale_price: '',
  sale_date: new Date().toISOString().split('T')[0]
};

/**
 * Food Sales Tab Component
 * @param {Object} props - Component props
 * @param {Array} props.foodRecipes - List of food recipes
 * @returns {JSX.Element} FoodSalesTab component
 */
const FoodSalesTab = ({ foodRecipes }) => {
  const {
    formData,
    isLoading,
    handleChange,
    handleDateChange,
    handleSubmit
  } = useSalesForm('food', INITIAL_STATE);

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Food Recipe</Form.Label>
            <Form.Select
              value={formData.recipe_id}
              onChange={(e) => handleChange('recipe_id', e.target.value)}
              required
            >
              <option value="">Select a food recipe</option>
              {foodRecipes.map(recipe => (
                <option key={recipe.recipe_id} value={recipe.recipe_id}>
                  {recipe.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => handleChange('quantity', parseInt(e.target.value))}
              required
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Label>Sale Price</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              min="0"
              value={formData.sale_price}
              onChange={(e) => handleChange('sale_price', parseFloat(e.target.value))}
              required
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <DatePickerField
              label="Sale Date"
              selected={formData.sale_date ? new Date(formData.sale_date) : new Date()}
              onChange={handleDateChange}
            />
          </Form.Group>
        </Col>
        <Col md={6} className="d-flex align-items-end">
          <Button 
            type="submit" 
            variant="success" 
            className="mb-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Recording...
              </>
            ) : (
              <>
                <FaPlus className="me-2" />
                Record Food Sale
              </>
            )}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default FoodSalesTab; 