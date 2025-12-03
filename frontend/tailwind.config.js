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
        primary: {
          DEFAULT: '#4F46E5', // Indigo 600
          hover: '#4338CA',   // Indigo 700
          light: '#818CF8',   // Indigo 400
        },
        secondary: {
          DEFAULT: '#64748B', // Slate 500
          hover: '#475569',   // Slate 600
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F3F4F6',   // Gray 100
        },
        success: '#10B981',   // Emerald 500
        warning: '#F59E0B',   // Amber 500
        error: '#E11D48',     // Rose 600
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
