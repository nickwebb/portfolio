import React from 'react';
import next from 'next/package.json';

export const checkVersions = () => {
  try {
    console.log('=== Version Check ===');
    console.log({
      react: React.version,
      next: next.version,
      node: process.version,
    });

    // Check for version compatibility
    const [reactMajor, reactMinor] = React.version.split('.');
    if (reactMajor !== '18' || parseInt(reactMinor) < 2) {
      console.warn('Potential React version compatibility issue');
    }
  } catch (error) {
    console.error('Version check failed:', error);
  }
}; 