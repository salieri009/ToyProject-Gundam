/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'crt-bg': '#1a1a1a',
        'crt-text': '#00ff00',
        'crt-glow': '#00ff00',
      },
      fontFamily: {
        mono: ['VT323', 'monospace'],
      },
      animation: {
        'scan-line': 'scan 8s linear infinite',
        'flicker': 'flicker 0.15s infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.95 },
        },
      },
    },
  },
  plugins: [],
}