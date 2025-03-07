export const checkServerState = () => {
  try {
    console.log('=== Server State Check ===');
    console.log({
      isServer: typeof window === 'undefined',
      isDev: process.env.NODE_ENV === 'development',
      hasWebpack: typeof __webpack_require__ !== 'undefined',
      nextConfig: process.env.__NEXT_CONFIG,
      buildId: process.env.__NEXT_BUILD_ID,
    });

    // Check for common development server issues
    if (typeof window !== 'undefined') {
      console.log('Client-side HMR state:', {
        webpackHot: typeof module.hot !== 'undefined',
        reactRefresh: typeof window.__REACT_REFRESH_RUNTIME__ !== 'undefined',
      });
    }
  } catch (error) {
    console.error('Server state check failed:', error);
  }
}; 