/* eslint-disable @typescript-eslint/no-require-imports */
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: '#e1803b',
      black: colors.black,
      white: colors.white,
      gray: colors.slate,
      green: colors.emerald,
      purple: colors.violet,
      yellow: colors.amber,
      pink: colors.fuchsia,
      blue: colors.blue,
      red: colors.red,
    },
    extend: {
      transitionProperty: {
        height: 'height',
        'max-height': 'max-height',
      },
    },
  },
  plugins: [],
};
