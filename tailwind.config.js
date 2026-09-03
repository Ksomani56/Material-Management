/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core surfaces (mapped to CSS vars)
        "bg": "var(--bg)",
        "bg-surface": "var(--bg-surface)",
        "bg-card": "var(--bg-card)",
        "bg-sidebar": "var(--bg-sidebar)",
        "bg-hover": "var(--bg-hover)",
        "bg-input": "var(--bg-input)",
        // Borders
        "border-ui": "var(--border)",
        "border-subtle": "var(--border-subtle)",
        // Text
        "txt-primary": "var(--text-primary)",
        "txt-secondary": "var(--text-secondary)",
        "txt-muted": "var(--text-muted)",
        // Accent
        "accent": "var(--accent)",
        "accent-dim": "var(--accent-dim)",
        "accent2": "var(--accent2)",
        // Status
        "clr-success": "var(--success)",
        "clr-warning": "var(--warning)",
        "clr-error": "var(--error)",
        "clr-info": "var(--info)",

        // Legacy aliases kept for existing screen components
        "background": "var(--bg)",
        "on-background": "var(--text-primary)",
        "surface": "var(--bg-surface)",
        "surface-container-low": "var(--bg-input)",
        "surface-container": "var(--bg-card)",
        "surface-container-high": "var(--bg-hover)",
        "surface-container-highest": "var(--border)",
        "on-surface": "var(--text-primary)",
        "on-surface-variant": "var(--text-secondary)",
        "outline": "var(--border)",
        "outline-variant": "var(--border-subtle)",
        "primary": "var(--accent)",
        "on-primary": "#022c1e",
        "status-success": "var(--success)",
        "status-warning": "var(--warning)",
        "status-error": "var(--error)",
        "status-info": "var(--info)",
        "relationship-identical": "var(--accent)",
        "relationship-duplicate": "var(--accent2)",
        "relationship-near": "var(--warning)",
      },
      fontFamily: {
        "sans": ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        "mono": ["JetBrains Mono", "Fira Code", "Courier New", "monospace"],
        // legacy aliases
        "data-mono": ["JetBrains Mono", "monospace"],
        "body-standard": ["Inter", "sans-serif"],
        "headline-section": ["Inter", "sans-serif"],
      },
      borderRadius: {
        "sm": "4px",
        "DEFAULT": "6px",
        "md": "8px",
        "lg": "10px",
        "xl": "12px",
        "2xl": "16px",
        "full": "9999px",
      },
      spacing: {
        "13": "52px",
        "margin-page": "24px",
      }
    }
  },
  plugins: [],
}
