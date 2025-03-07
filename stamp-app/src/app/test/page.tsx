'use client';

export default function TestPage() {
  console.log('DEBUG: Test page rendering');
  
  return (
    <div style={{padding: '20px'}}>
      <div className="bg-red-500 p-4">
        This should be red with padding
      </div>
      <div className="mt-4 bg-blue-500 p-4">
        This should be blue with margin-top
      </div>
    </div>
  );
} 