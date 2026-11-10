/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          light: '#FBFBF9',
          cream: '#F4F3EE',
          card: '#FFFFFF',
          dark: '#121614',
          'dark-card': '#1B211E'
        },
        forest: {
          50: '#F0F5F2',
          100: '#DFECE5',
          200: '#C0D9CD',
          300: '#94BEAC',
          400: '#649E87',
          500: '#3D7F67',
          600: '#2C6450',
          700: '#235041',
          800: '#1E3A2F', // Primary Forest Green
          900: '#162E25',
          950: '#0C1B15',
        },
        sage: {
          50: '#F4F7F4',
          100: '#E6EDE7',
          200: '#D1DEC3',
          300: '#B6CCA6',
          400: '#9DB78C',
          500: '#7E9F8B', // Soft sage green
          600: '#658271',
          700: '#4F6659',
          800: '#3E4F46',
          900: '#334139',
        },
        charcoal: {
          50: '#F7F7F8',
          100: '#EFEFEF',
          200: '#DCDDDE',
          300: '#BDBFB8',
          400: '#8A8D8B',
          600: '#4A504B',
          700: '#2D312E',
          800: '#1F2421', // Charcoal typography
          900: '#151917',
        },
        warmgray: {
          50: '#FAF9F7',
          100: '#F3F2EE',
          200: '#E6E5E0',
          300: '#D5D3CC',
          400: '#A8A69E',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif']
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'premium': '0 4px 20px -2px rgba(30, 58, 47, 0.08), 0 2px 6px -1px rgba(30, 58, 47, 0.04)',
        'premium-hover': '0 12px 32px -4px rgba(30, 58, 47, 0.14), 0 4px 12px -2px rgba(30, 58, 47, 0.08)',
        'glow': '0 0 25px -5px rgba(61, 127, 103, 0.35)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-reverse': 'floatReverse 7s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        }
      }
    },
  },
  plugins: [],
}
