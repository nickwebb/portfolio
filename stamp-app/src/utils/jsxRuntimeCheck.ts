export const checkJsxRuntime = () => {
  console.log('=== JSX Runtime Check ===');
  try {
    const jsxRuntime = require('react/jsx-runtime');
    const jsxDevRuntime = require('react/jsx-dev-runtime');
    
    console.log({
      jsxRuntimeExports: Object.keys(jsxRuntime),
      jsxDevRuntimeExports: Object.keys(jsxDevRuntime),
      babelConfig: process.env.BABEL_ENV,
      nodeEnv: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('JSX Runtime Error:', error);
  }
}; 