module.exports = {
  plugins: {
    'postcss-import': {
      debug: true
    },
    'tailwindcss/nesting': {},
    tailwindcss: {
      debug: true,
      config: './tailwind.config.ts'
    },
    autoprefixer: {
      debug: true
    },
  },
} 