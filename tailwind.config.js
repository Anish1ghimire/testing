/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0D0D0D',
        'neon-blue': '#00D1FF',
        'neon-purple': '#9D4EDD',
        'dark-gray': '#1A1A1A',
        'light-gray': '#BFBFBF',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'neon-gradient': 'linear-gradient(135deg, #00D1FF 0%, #9D4EDD 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 100%)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-neon': 'pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px #00D1FF' },
          '100%': { boxShadow: '0 0 30px #00D1FF, 0 0 40px #9D4EDD' },
        },
        'pulse-neon': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
      },
    },
  },
  plugins: [],
};