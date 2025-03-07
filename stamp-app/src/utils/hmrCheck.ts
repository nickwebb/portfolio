export const checkHMRState = () => {
  console.log('=== HMR State Check ===');
  console.log({
    moduleHot: typeof module !== 'undefined' && !!module.hot,
    webpackHMR: typeof window !== 'undefined' && !!window.__webpack_hash__,
    reactRefresh: typeof window !== 'undefined' && !!window.__REACT_REFRESH_RUNTIME__,
    nextHMR: typeof window !== 'undefined' && !!window.__NEXT_HMR,
    moduleResolution: process.env.__NEXT_RESOLVE_MODE
  });
}; 