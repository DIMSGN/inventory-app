import React from 'react';
import * as FaIcons from 'react-icons/fa';

// Map of Font Awesome class names to react-icons components
const iconMap = {
  // Edit icons
  'fa-edit': FaIcons.FaEdit,
  'fa-trash-alt': FaIcons.FaTrashAlt,
  'fa-save': FaIcons.FaSave,
  'fa-times': FaIcons.FaTimes,
  
  // Action icons
  'fa-plus': FaIcons.FaPlus,
  'fa-plus-circle': FaIcons.FaPlusCircle,
  'fa-list': FaIcons.FaList,
  'fa-check': FaIcons.FaCheck,
  
  // Navigation icons
  'fa-caret-down': FaIcons.FaCaretDown,
  'fa-filter': FaIcons.FaFilter,
  
  // Content icons
  'fa-box-open': FaIcons.FaBoxOpen,
  'fa-tag': FaIcons.FaTag,
  'fa-not-equal': FaIcons.FaNotEqual,
  'fa-calculator': FaIcons.FaCalculator,
  'fa-palette': FaIcons.FaPalette,
  'fa-barcode': FaIcons.FaBarcode,
  
  // Export icons
  'fa-file-export': FaIcons.FaFileExport,
  'fa-file-pdf': FaIcons.FaFilePdf,
  'fa-shopping-cart': FaIcons.FaShoppingCart,
  'fa-cubes': FaIcons.FaCubes,
};

/**
 * Icon component that maps Font Awesome class names to react-icons components
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Font Awesome class name (e.g., "fas fa-edit")
 * @param {Object} props.style - Inline styles for the icon
 * @returns {React.Component} React Icon component
 */
const Icon = ({ className, style = {}, ...rest }) => {
  // Extract the icon name from the className (e.g., "fas fa-edit" => "fa-edit")
  const iconName = className?.split(' ').find(cls => cls.startsWith('fa-'));
  
  if (!iconName) {
    console.warn(`Icon name not found in className: ${className}`);
    return null;
  }
  
  // Get the corresponding react-icons component
  const IconComponent = iconMap[iconName];
  
  if (!IconComponent) {
    console.warn(`Icon not found in map: ${iconName}`);
    return null;
  }
  
  return <IconComponent style={style} {...rest} />;
};

export default Icon; 