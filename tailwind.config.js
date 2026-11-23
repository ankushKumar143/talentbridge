/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        p: '#6C5CE7',
        p2: '#8B7CF6',
        lav: '#F0EDFF',
        bg: '#F7F7FB',
        ink: '#202039',
        mute: '#77778B',
        line: '#EAE8F0',
        ok: '#19A985',
        warn: '#F59E0B',
        err: '#DC6262',
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(32,32,57,0.05), 0 1px 2px rgba(32,32,57,0.03)',
        'card': '0 4px 12px rgba(32,32,57,0.06)',
      }
    },
  },
  plugins: [],
}
