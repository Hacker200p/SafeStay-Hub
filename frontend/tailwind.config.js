/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        accent: '#F97316',
        background: '#F9FAFB',
        'text-dark': '#111827',
        'text-muted': '#6B7280',
        success: '#22C55E',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
      },
      spacing: {
        // 8px spacing grid
        xs: '0.5rem',   // 8px
        sm: '1rem',     // 16px
        md: '1.5rem',   // 24px
        lg: '2rem',     // 32px
        xl: '3rem',     // 48px
      },
      borderRadius: {
        DEFAULT: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
}
