import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // TFG aubergine / deep purple — pulled from the brand mark
        aubergine: {
          50:  "#F5EFF4",
          100: "#E8DCE6",
          200: "#C9A8C4",
          300: "#A674A0",
          400: "#7E477C",
          500: "#5B2D5C",
          600: "#421F44",  // primary
          700: "#321734",
          800: "#221024",
          900: "#150A17",
        },
        paper:  "#F7F4EE", // warm off-white
        ink:    "#1A1418", // near-black with purple bias
        bone:   "#EDE7DC",
        rust:   "#C45A2C", // accent for emphasis
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans:    ['"Inter Tight"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'dot-grid':
          'radial-gradient(circle, rgba(26,20,24,0.08) 1px, transparent 1px)',
      },
      backgroundSize: {
        'dot-grid': '24px 24px',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)',   opacity: '0.85' },
          '50%':      { transform: 'scale(1.06)', opacity: '1' },
        },
        rise: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        breathe: 'breathe 2.4s ease-in-out infinite',
        rise:    'rise 0.6s ease-out both',
      },
    },
  },
  plugins: [],
};
export default config;
