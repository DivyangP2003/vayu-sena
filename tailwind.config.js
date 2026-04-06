/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-syne)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
        display: ['var(--font-syne)', 'sans-serif'],
      },
      colors: {
        bg: {
          primary: '#0a0f0d',
          secondary: '#0f1a15',
          card: '#111f17',
          border: '#1a2e22',
        },
        accent: {
          green: '#00ff88',
          lime: '#a8ff3e',
          amber: '#ffb800',
          red: '#ff4444',
          orange: '#ff6b00',
          blue: '#00d4ff',
        },
        aqi: {
          good: '#00ff88',
          satisfactory: '#a8ff3e',
          moderate: '#ffb800',
          poor: '#ff6b00',
          very_poor: '#ff4444',
          severe: '#cc00ff',
        },
        text: {
          primary: '#e8f5ee',
          secondary: '#7ab898',
          muted: '#3d6b52',
        }
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)',
        'glow-green': 'radial-gradient(ellipse at center, rgba(0,255,136,0.15) 0%, transparent 70%)',
        'glow-amber': 'radial-gradient(ellipse at center, rgba(255,184,0,0.12) 0%, transparent 70%)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 3s linear infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        }
      },
      boxShadow: {
        'green-glow': '0 0 20px rgba(0,255,136,0.3)',
        'green-glow-lg': '0 0 40px rgba(0,255,136,0.2)',
        'amber-glow': '0 0 20px rgba(255,184,0,0.3)',
        'red-glow': '0 0 20px rgba(255,68,68,0.3)',
        'card': '0 1px 0 rgba(0,255,136,0.05), inset 0 1px 0 rgba(255,255,255,0.02)',
      }
    },
  },
  plugins: [],
}
