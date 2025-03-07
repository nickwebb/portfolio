export default {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
    'postcss-preset-env': {
      features: { 'nesting-rules': true },
      stage: 3,
      autoprefixer: false
    }
  }
} 