/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        bebas: ['Bebas Neue', 'cursive'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        red: {
          500: '#e50914',
          600: '#c40812',
          700: '#a00710',
          800: '#7a0509',
          900: '#500306',
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'flicker': 'flicker 4s infinite',
      },
    },
  },
  plugins: [],
};
