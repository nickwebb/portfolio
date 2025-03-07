import React from 'react';

export const TestJSXComponent = () => {
  try {
    console.log('=== JSX Runtime Check ===');
    console.log('JSX Runtime:', {
      jsxRuntime: process.env.__NEXT_REACT_ROOT,
      jsxSource: React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?.ReactSharedInternals?.ReactCurrentOwner,
    });
    
    return <div>JSX Test Component</div>;
  } catch (error) {
    console.error('JSX runtime check failed:', error);
    return null;
  }
}; 