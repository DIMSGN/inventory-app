/**
 * reportWebVitals Function
 * This function measures and reports web vitals performance metrics.
 * It uses the web-vitals library to measure metrics such as CLS, FID, FCP, LCP, and TTFB.
 * 
 * Web Vitals are a set of metrics that measure the performance and user experience of a web application.
 * These metrics help developers understand how their application performs in real-world scenarios.
 * 
 * @param {Function} onPerfEntry - A function to handle the performance entries.
 * This function will be called with the performance metrics as they are measured.
 */
const reportWebVitals = (onPerfEntry) => {
  // Check if onPerfEntry is a function
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Dynamically import the web-vitals library
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Measure and report the Cumulative Layout Shift (CLS) metric
      // CLS measures the visual stability of the page by tracking unexpected layout shifts.
      getCLS(onPerfEntry);
      
      // Measure and report the First Input Delay (FID) metric
      // FID measures the time from when a user first interacts with the page to when the browser responds to that interaction.
      getFID(onPerfEntry);
      
      // Measure and report the First Contentful Paint (FCP) metric
      // FCP measures the time from when the page starts loading to when any part of the page's content is rendered on the screen.
      getFCP(onPerfEntry);
      
      // Measure and report the Largest Contentful Paint (LCP) metric
      // LCP measures the time from when the page starts loading to when the largest text block or image is rendered on the screen.
      getLCP(onPerfEntry);
      
      // Measure and report the Time to First Byte (TTFB) metric
      // TTFB measures the time from when the user requests the page to when the server responds with the first byte of the page.
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;

/**
 * Explanation of Imports:
 * - The web-vitals library is dynamically imported to measure web vitals performance metrics.
 *   This library provides functions to measure key performance metrics that are critical for understanding the user experience.
 * 
 * Why it’s implemented this way:
 * - The reportWebVitals function is designed to measure and report web vitals performance metrics.
 *   These metrics provide insights into the performance and user experience of the web application.
 * - The function checks if the onPerfEntry parameter is a function before proceeding.
 *   This ensures that the provided parameter can handle the performance entries.
 * - The web-vitals library is dynamically imported to reduce the initial bundle size and only load the library when needed.
 *   This approach improves the initial load performance of the application.
 * - The getCLS, getFID, getFCP, getLCP, and getTTFB functions from the web-vitals library are used to measure specific performance metrics.
 *   Each function measures a different aspect of the web application's performance and user experience.
 * - Each metric function is called with the onPerfEntry parameter to report the measured metrics.
 *   This allows the application to handle the performance metrics as they are measured, either by logging them to the console or sending them to an analytics endpoint.
 */
