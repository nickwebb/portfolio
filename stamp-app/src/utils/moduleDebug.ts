const debugModules = () => {
  try {
    console.log('=== Module Debug Info ===');
    console.log('Runtime:', {
      nextRuntime: process.env.NEXT_RUNTIME,
      nodeEnv: process.env.NODE_ENV,
      isClient: typeof window !== 'undefined',
    });

    // Test module resolution
    const modules = {
      react: require.resolve('react'),
      'react/jsx-runtime': require.resolve('react/jsx-runtime'),
      'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime'),
    };

    console.log('Module Resolution:', modules);
  } catch (error) {
    console.error('Module Resolution Error:', error);
  }
};

export default debugModules; 