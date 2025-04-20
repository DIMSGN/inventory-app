import { useEffect } from 'react';

/**
 * PreloadResources Component
 * 
 * Optimizes initial page load by preloading critical resources
 * that impact the Largest Contentful Paint (LCP)
 */
const PreloadResources = () => {
  useEffect(() => {
    // Preload the Header component styles
    const preloadHeaderStyles = document.createElement('link');
    preloadHeaderStyles.rel = 'preload';
    preloadHeaderStyles.as = 'style';
    preloadHeaderStyles.href = '/static/css/Header.module.css';
    document.head.appendChild(preloadHeaderStyles);

    // Preload gradient background for the header
    const preloadMainBackground = document.createElement('style');
    preloadMainBackground.textContent = `
      .gradientBackground {
        background: linear-gradient(135deg, #8a1dff 0%, #2575fc 100%);
        background-size: 200% 200%;
      }
      .inventoryBox {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      }
    `;
    document.head.appendChild(preloadMainBackground);
    
    // Preload SVG pattern as base64 to avoid additional network request
    const svgPattern = document.createElement('link');
    svgPattern.rel = 'preload';
    svgPattern.as = 'image';
    svgPattern.href = "data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='rgba(255,255,255,0.05)' fill-rule='evenodd'/%3E%3C/svg%3E";
    document.head.appendChild(svgPattern);

    // Preload gaming-style fonts
    const fontLinks = [
      {
        href: 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;700&display=swap',
        rel: 'stylesheet'
      },
      {
        href: 'https://fonts.googleapis.com/css2?family=Audiowide&display=swap',
        rel: 'stylesheet'
      }
    ];
    
    const fontElements = fontLinks.map(font => {
      const link = document.createElement('link');
      link.href = font.href;
      link.rel = font.rel;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
      return link;
    });

    // Cleanup function
    return () => {
      document.head.removeChild(preloadHeaderStyles);
      document.head.removeChild(preloadMainBackground);
      document.head.removeChild(svgPattern);
      fontElements.forEach(el => document.head.removeChild(el));
    };
  }, []);

  // This component doesn't render anything
  return null;
};

export default PreloadResources; 