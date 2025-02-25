/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: {
          dark: '#0B0D17',
          blue: '#1B1F3B',
          purple: '#2E1B3B',
          nebula: '#FF61D8',
          star: '#FFD700',
        },
      },
      backgroundImage: {
        'space-gradient': 'linear-gradient(to right, #0B0D17, #1B1F3B, #2E1B3B)',
        'space-bg': 'url("/src/assets/space-bg.jpg")',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}