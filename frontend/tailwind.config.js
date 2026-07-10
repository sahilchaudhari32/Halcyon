/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        halcyon: {
          bg: '#F9FAFB', // Soft off-white
          surface: '#FFFFFF', // Pure white
          'surface-raised': '#F3F4F6', // Subtle tint for hover/active
          teal: '#0D9488', // Deepened kingfisher teal
          amber: '#EA580C', // Vibrant burnt orange/amber
          text: '#111827', // Deep slate
          'text-muted': '#6B7280', // Cool gray
          border: '#E5E7EB' // Soft clean divider
        }
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'halcyon-glow-teal': '0 0 20px -5px rgba(13, 148, 136, 0.4)',
        'halcyon-glow-amber': '0 0 20px -5px rgba(234, 88, 12, 0.4)',
      }
    },
  },
  plugins: [],
}
