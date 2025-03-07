'use client';

import { useEffect, useState } from 'react';

export default function StyleTest() {
  const [styleInfo, setStyleInfo] = useState<any>(null);

  useEffect(() => {
    // Test element for style checking
    const testElement = document.createElement('div');
    testElement.className = 'test-css-processing p-4 bg-blue-500';
    document.body.appendChild(testElement);

    // Get computed styles
    const computedStyle = window.getComputedStyle(testElement);

    // Check if Tailwind classes are being processed
    const styleData = {
      backgroundColor: computedStyle.backgroundColor,
      padding: computedStyle.padding,
      tailwindPresent: document.styleSheets.length > 0,
      processingTestClass: computedStyle.backgroundColor === 'rgb(255, 0, 0)', // Should be red from test-css-processing
      utilityClassWorking: computedStyle.backgroundColor === 'rgb(59, 130, 246)' // Should be blue from bg-blue-500
    };

    setStyleInfo(styleData);

    // Cleanup
    document.body.removeChild(testElement);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white shadow-lg rounded-lg z-50">
      <h3 className="font-bold mb-2">Style Processing Debug</h3>
      {styleInfo ? (
        <pre className="text-xs">
          {JSON.stringify(styleInfo, null, 2)}
        </pre>
      ) : (
        <p>Loading style info...</p>
      )}
    </div>
  );
} 