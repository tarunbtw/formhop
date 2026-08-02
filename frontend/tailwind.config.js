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
        mono: ['Geist Mono', 'SF Mono', 'Menlo', 'monospace'],
      },
      colors: {
        charcoal: {
          DEFAULT: '#2A2529',
          50: '#F5F4F5',
          100: '#E7E5E6',
          200: '#D0CBCE',
          300: '#B0A8AE',
          400: '#8A8088',
          500: '#6A5F67',
          600: '#524950',
          700: '#3D363C',
          800: '#2A2529',
          900: '#1D191C',
        },
        ivory: {
          DEFAULT: '#F3F0E7',
          50: '#FCFAF6',
          100: '#F8F6F0',
          200: '#F3F0E7',
          300: '#E8E3D4',
          400: '#DDD5BE',
          500: '#CEC2A4',
          600: '#BCAC87',
          700: '#9E8E6A',
          800: '#7F7253',
          900: '#61563E',
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
        'subtle-light': '0 1px 3px 0 rgba(42, 37, 41, 0.04), 0 1px 2px -1px rgba(42, 37, 41, 0.04)',
        'card-light': '0 2px 8px -2px rgba(42, 37, 41, 0.05), 0 1px 3px -1px rgba(42, 37, 41, 0.03)',
        'card-dark': '0 4px 16px -2px rgba(0, 0, 0, 0.35)',
      },
    },
  },
  plugins: [],
}

