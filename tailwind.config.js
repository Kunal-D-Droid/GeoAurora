/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        aurora: {
          purple: '#a259f7',
        },
        solar: {
          yellow: '#ffe066',
        },
        neon: {
          green: '#39ff14',
        },
      },
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      minHeight: {
        '44': '44px',
        '48': '48px',
      },
      minWidth: {
        '44': '44px',
        '48': '48px',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px - was 10px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],  // 14px - was 12px
        'base': ['1rem', { lineHeight: '1.5rem' }],     // 16px - was 14px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px - was 16px
        'xl': ['1.25rem', { lineHeight: '1.875rem' }],  // 20px - was 18px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px - was 20px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px - was 24px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px - new
        '5xl': ['3rem', { lineHeight: '1' }],           // 48px - new
        '6xl': ['3.75rem', { lineHeight: '1' }],        // 60px - new
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
    },
  },
  plugins: [],
};
