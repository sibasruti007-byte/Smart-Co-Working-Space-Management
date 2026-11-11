import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#060e20',
        card: '#0b1326',
        'card-accent': '#131b2e',
        'card-border': 'rgba(255, 255, 255, 0.08)',
        emerald: {
          DEFAULT: '#10b981',
          500: '#10b981',
          400: '#34d399',
        },
        cyan: {
          DEFAULT: '#06b6d4',
          400: '#22d3ee',
        },
        amber: {
          DEFAULT: '#f59e0b',
          400: '#fbbf24',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        'cyan-glow': '0 0 25px -5px rgba(6, 182, 212, 0.3)',
      },
    },
  },
  plugins: [],
};

export default config;

