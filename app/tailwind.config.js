/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        foreground: '#e2e8f0',
        card: { DEFAULT: '#1e293b', foreground: '#e2e8f0' },
        popover: { DEFAULT: '#1e293b', foreground: '#e2e8f0' },
        primary: { DEFAULT: '#8b5cf6', foreground: '#ffffff', light: '#a78bfa' },
        secondary: { DEFAULT: '#1e293b', foreground: '#e2e8f0' },
        muted: { DEFAULT: '#1e293b', foreground: '#94a3b8' },
        accent: { DEFAULT: '#1e293b', foreground: '#e2e8f0' },
        destructive: { DEFAULT: '#ef4444', foreground: '#fff' },
        border: 'rgba(139, 92, 246, 0.15)',
        input: '#1e293b',
        ring: '#8b5cf6',
      },
      fontFamily: {
        title: ["'Space Grotesk'", "'Inter'", 'sans-serif'],
        body: ["'Inter'", '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        lg: '8px',
        md: '6px',
        sm: '4px',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 40px rgba(139, 92, 246, 0.1)',
        'glow': '0 0 20px rgba(139, 92, 246, 0.15)',
        'glow-lg': '0 0 40px rgba(139, 92, 246, 0.2)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
