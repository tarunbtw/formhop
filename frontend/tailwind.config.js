/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Roboto Mono', 'SF Mono', 'Menlo', 'monospace'],
      },
      colors: {
        fc: {
          blue: '#005DFF',
          'blue-hover': '#1463FF',
          'blue-dark': '#293FFF',
          navy: '#0E0B3D',
          darkest: '#030122',
          muted: '#6C6F93',
          subtle: '#535479',
          'bg-alt': '#F7F9FC',
          'bg-tint': '#F0F5FF',
          border: '#DDE0EE',
          coral: '#F6285F',
          green: '#52E282',
          yellow: '#FFC933',
          purple: '#7214FF',
          cyan: '#21DDFF',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'fc-subtle': '0 2px 8px -2px rgba(14, 11, 61, 0.05), 0 1px 3px -1px rgba(14, 11, 61, 0.03)',
        'fc-card': '0 12px 32px -8px rgba(14, 11, 61, 0.08), 0 2px 6px -2px rgba(14, 11, 61, 0.04)',
        'fc-button': '0 4px 14px 0 rgba(0, 93, 255, 0.28)',
      },
    },
  },
  plugins: [],
}
