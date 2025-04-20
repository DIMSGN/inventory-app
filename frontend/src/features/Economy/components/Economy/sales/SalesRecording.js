import React, { useState } from 'react';
import { 
  Container, Card, Tabs, Tab 
} from 'react-bootstrap';
import { FaUtensils, FaCoffee, FaCocktail, FaWineBottle } from 'react-icons/fa';

// Custom hooks
import useSalesData from './hooks/useSalesData';

// Components
import SalesTabContainer from './components/SalesTabContainer';
import {
  FoodSalesTab,
  CoffeeSalesTab,
  CocktailSalesTab,
  DrinkSalesTab
} from './components/tabs';

/**
 * SalesRecording component for recording various types of sales
 * @returns {JSX.Element} SalesRecording component
 */
const SalesRecording = () => {
  const [activeTab, setActiveTab] = useState("food");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Fetch recipes and products data using the custom hook
  const {
    isLoading: dataLoading,
    error: dataError,
    foodRecipes,
    coffeeRecipes,
    cocktailRecipes,
    drinks
  } = useSalesData();
  
  // Set data error if present
  React.useEffect(() => {
    if (dataError) {
      setError(dataError);
    }
  }, [dataError]);
  
  return (
    <Container fluid className="p-4">
      <Card className="shadow border-0">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Record Sales</h4>
        </Card.Header>
        <Card.Body>
          <SalesTabContainer
            error={error}
            success={success}
            onErrorDismiss={() => setError(null)}
            onSuccessDismiss={() => setSuccess(null)}
          >
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-4"
            >
              <Tab 
                eventKey="food" 
                title={
                  <span>
                    <FaUtensils className="me-2" />
                    Food
                  </span>
                }
              >
                <FoodSalesTab 
                  foodRecipes={foodRecipes} 
                />
              </Tab>
              
              <Tab
                eventKey="coffee"
                title={
                  <span>
                    <FaCoffee className="me-2" />
                    Coffee & Beverages
                  </span>
                }
              >
                <CoffeeSalesTab 
                  coffeeRecipes={coffeeRecipes} 
                />
              </Tab>
              
              <Tab
                eventKey="cocktail"
                title={
                  <span>
                    <FaCocktail className="me-2" />
                    Cocktails
                  </span>
                }
              >
                <CocktailSalesTab 
                  cocktailRecipes={cocktailRecipes} 
                />
              </Tab>
              
              <Tab
                eventKey="drink"
                title={
                  <span>
                    <FaWineBottle className="me-2" />
                    Direct Drinks
                  </span>
                }
              >
                <DrinkSalesTab 
                  drinks={drinks} 
                />
              </Tab>
            </Tabs>
          </SalesTabContainer>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SalesRecording; 