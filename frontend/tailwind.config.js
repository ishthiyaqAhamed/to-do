module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1C2333',
        paper: '#F3F4F1',
        line: '#D9DAD4',
        brass: '#B8863B',
        forest: '#3F6C51',
        slate: '#6B7280',
        brick: '#A23B3B',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        sans: ['var(--font-plex)', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '2px',
      },
    },
  },
  plugins: [],
};