/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--ne-canvas)',
        surface: 'var(--ne-surface)',
        border: 'var(--ne-border)',
        divider: 'var(--ne-divider)',
        primary: 'var(--ne-primary)',
        'primary-alt': 'var(--ne-primary-alt)',
        'primary-dark': 'var(--ne-primary-dark)',
        'primary-light': 'var(--ne-primary-light)',
        secondary: 'var(--ne-secondary)',
        success: 'var(--ne-success)',
        danger: 'var(--ne-danger)',
        warning: 'var(--ne-warning)',
        text: 'var(--ne-text)',
        'text-secondary': 'var(--ne-text-secondary)',
        muted: 'var(--ne-text-muted)',
        accent1: 'var(--ne-accent-1)',
        accent2: 'var(--ne-accent-2)',
      },
      boxShadow: {
        card: 'var(--ne-shadow-1)',
        'card-2': 'var(--ne-shadow-2)'
      },
      borderRadius: {
        card: 'var(--ne-radius-card)',
        input: 'var(--ne-radius-input)',
        button: 'var(--ne-radius-button)'
      },
    }
  },
  plugins: [],
}
