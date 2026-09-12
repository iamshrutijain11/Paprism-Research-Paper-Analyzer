/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'soft-white': '#F7FBF9',
        'primary-mint': '#C8F3E4',
        'primary-emerald': '#00A878',
        'deep-emerald': '#006B57',
        'dark-teal': '#003F36',
        'text-primary': '#12352F',
        'text-secondary': '#60736E',
        'editorial-bg': '#F7FBF9',
        'card-border': 'rgba(0, 63, 54, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"DM Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'float': '0 8px 30px rgba(0, 64, 54, 0.06)',
        'float-hover': '0 16px 36px rgba(0, 64, 54, 0.12)',
        'elevated': '0 20px 45px rgba(0, 63, 54, 0.09)',
        'glow-mint': '0 0 25px rgba(200, 243, 228, 0.6)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
