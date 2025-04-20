import { useLocation, useNavigate } from 'react-router-dom';
import { routeTitles } from '../routes';

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const routes = {
    dashboard: '/',
    inventory: '/inventory',
    economy: '/economy',
    'economy/financials': '/economy/financials',
    recipes: '/recipes',
    barman: '/barman-dashboard',
    chef: '/chef-dashboard',
    manager: '/manager-dashboard'
  };

  /**
   * Handle navigation to a specific section
   * @param {string} item - The section identifier
   */
  const handleNavigation = (item) => {
    console.log("Navigation requested to:", item);
    
    if (routes[item]) {
      navigate(routes[item]);
    } else {
      navigate('/');
    }
  };

  /**
   * Determine active sidebar item from current path
   * @returns {string} The active section identifier
   */
  const getActiveItemFromPath = () => {
    const path = location.pathname;
    
    // Check specific paths first
    if (path === '/' || path === '') return 'dashboard';
    if (path.includes('economy/financials')) return 'economy/financials';
    
    // Then check more general paths
    const pathMap = [
      { prefix: '/inventory', section: 'inventory' },
      { prefix: '/economy', section: 'economy' },
      { prefix: '/recipes', section: 'recipes' },
      { prefix: '/barman-dashboard', section: 'barman' },
      { prefix: '/chef-dashboard', section: 'chef' },
      { prefix: '/manager-dashboard', section: 'manager' }
    ];
    
    const match = pathMap.find(item => path.includes(item.prefix));
    return match ? match.section : 'dashboard';
  };

  /**
   * Get title based on active section
   * @returns {string} The title for the current section
   */
  const getHeaderTitle = () => {
    const activeItem = getActiveItemFromPath();
    return routeTitles[activeItem] || 'Management System';
  };

  return { 
    handleNavigation, 
    getActiveItemFromPath,
    getHeaderTitle
  };
}; 