import * as ReactAll from 'react';

export const checkReactExports = () => {
  console.log('=== React Exports Check ===');
  console.log({
    availableExports: Object.keys(ReactAll),
    hasCreateElement: 'createElement' in ReactAll,
    hasUseEffect: 'useEffect' in ReactAll,
    reactVersion: ReactAll.version,
    isDevRuntime: process.env.NODE_ENV === 'development'
  });
}; 