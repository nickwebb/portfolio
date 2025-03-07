import type { Config } from 'tailwindcss';
import fs from 'fs';
import path from 'path';

console.log('DEBUG: Loading Tailwind config...');

// Debug function to check content files
function checkContentFiles(patterns: string[]) {
  patterns.forEach(pattern => {
    const dir = pattern.split('/*')[0];
    try {
      const files = fs.readdirSync(path.join(process.cwd(), dir));
      console.log(`Files in ${dir}:`, files);
    } catch (e) {
      console.log(`Error reading ${dir}:`, e);
    }
  });
}

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          900: '#171717',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'waveform': 'waveform 1.5s ease-in-out infinite',
      },
      keyframes: {
        waveform: {
          '0%, 100%': { transform: 'scaleY(0.5)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
  safelist: [
    'bg-purple-400',
    'bg-purple-500',
    'bg-purple-600',
    'text-purple-400',
    'text-purple-500',
    'text-purple-600',
    {
      pattern: /^(bg|text|border)-(purple)-(400|500|600)/,
      variants: ['hover', 'focus', 'active'],
    },
  ],
};

// Debug output
console.log('DEBUG: Tailwind config loaded with:', {
  contentPaths: config.content,
  themeExtensions: Object.keys(config.theme?.extend || {}),
  darkMode: config.darkMode,
});

checkContentFiles(config.content as string[]);

export default config; 