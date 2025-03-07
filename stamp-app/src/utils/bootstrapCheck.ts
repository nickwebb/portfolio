export const checkNextBootstrap = () => {
  console.log('=== Next.js Bootstrap Check ===');
  console.log({
    hasDocument: typeof document !== 'undefined',
    hasWindow: typeof window !== 'undefined',
    nextData: typeof window !== 'undefined' ? window.__NEXT_DATA__ : undefined,
    nextBuild: process.env.NEXT_PHASE,
    hasBootstrap: typeof window !== 'undefined' ? !!document.getElementById('__NEXT_DATA__') : false
  });
}; 