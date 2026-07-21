import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Near-black world. `void` is the canvas clear colour — everything
        // else sits on top of it, so nothing should be darker.
        void: '#040507',
        abyss: '#08090d',
        surface: '#0d0f14',
        edge: 'rgba(255,255,255,0.08)',
        accent: {
          DEFAULT: '#5eead4',
          warm: '#a78bfa',
          hot: '#f0abfc',
        },
        ink: {
          DEFAULT: '#e8eaf0',
          dim: '#9aa1b1',
          faint: '#5c6373',
        },
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      letterSpacing: {
        wider2: '0.18em',
        wider3: '0.32em',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
