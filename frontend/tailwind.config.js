module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          50: '#eef2f8',
          100: '#dbe3f0',
          200: '#b3c2dd',
          300: '#8aa1ca',
          400: '#51709f',
          500: '#2f4a78',
          600: '#223a63',
          700: '#182a49', // Main navy brand color
          800: '#101d33',
          900: '#0a1220',
        },
        'gold': {
          50: '#fdf8ec',
          100: '#faeec9',
          200: '#f3d98c',
          300: '#e9c15c',
          400: '#dcab3c',
          500: '#c9962c',
          600: '#a97a20', // Main gold accent
          700: '#87611b',
          800: '#6b4c17',
          900: '#573e14',
        },
      },
    },
  },
  plugins: [],
}