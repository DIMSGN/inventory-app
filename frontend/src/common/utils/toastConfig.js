/**
 * Toast notification configuration
 */

export const standardToastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light"
};

export default standardToastConfig;

export const errorToastConfig = {
  ...standardToastConfig,
  autoClose: 4000, // Errors stay longer
  role: 'alert',
  'aria-live': 'assertive'
}; 