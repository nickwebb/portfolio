export const checkAppRouter = () => {
  console.log('=== App Router Check ===');
  console.log({
    nextRuntime: process.env.NEXT_RUNTIME,
    isEdgeRuntime: process.env.NEXT_RUNTIME === 'edge',
    isServerComponent: process.env.__NEXT_PRIVATE_PREBUNDLED_REACT,
    turbopack: process.env.TURBOPACK,
    experimental: process.env.__NEXT_EXPERIMENTAL_REACT
  });
}; 