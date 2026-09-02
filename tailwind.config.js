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
        "surface": "var(--surface)",
        "surface-dim": "var(--surface-dim)",
        "surface-bright": "var(--surface-bright)",
        "surface-container-lowest": "var(--surface-container-lowest)",
        "surface-container-low": "var(--surface-container-low)",
        "surface-container": "var(--surface-container)",
        "surface-container-high": "var(--surface-container-high)",
        "surface-container-highest": "var(--surface-container-highest)",
        "on-surface": "var(--on-surface)",
        "on-surface-variant": "var(--on-surface-variant)",
        "inverse-surface": "var(--inverse-surface)",
        "inverse-on-surface": "var(--inverse-on-surface)",
        "outline": "var(--outline)",
        "outline-variant": "var(--outline-variant)",
        "surface-tint": "var(--surface-tint)",
        "primary": "var(--primary)",
        "on-primary": "var(--on-primary)",
        "primary-container": "var(--primary-container)",
        "on-primary-container": "var(--on-primary-container)",
        "inverse-primary": "var(--inverse-primary)",
        "secondary": "var(--secondary)",
        "on-secondary": "var(--on-secondary)",
        "secondary-container": "var(--secondary-container)",
        "on-secondary-container": "var(--on-secondary-container)",
        "tertiary": "var(--tertiary)",
        "on-tertiary": "var(--on-tertiary)",
        "tertiary-container": "var(--tertiary-container)",
        "on-tertiary-container": "var(--on-tertiary-container)",
        "error": "var(--error)",
        "on-error": "var(--on-error)",
        "error-container": "var(--error-container)",
        "on-error-container": "var(--on-error-container)",
        "primary-fixed": "var(--primary-fixed)",
        "primary-fixed-dim": "var(--primary-fixed-dim)",
        "on-primary-fixed": "var(--on-primary-fixed)",
        "on-primary-fixed-variant": "var(--on-primary-fixed-variant)",
        "secondary-fixed": "var(--secondary-fixed)",
        "secondary-fixed-dim": "var(--secondary-fixed-dim)",
        "on-secondary-fixed": "var(--on-secondary-fixed)",
        "on-secondary-fixed-variant": "var(--on-secondary-fixed-variant)",
        "tertiary-fixed": "var(--tertiary-fixed)",
        "tertiary-fixed-dim": "var(--tertiary-fixed-dim)",
        "on-tertiary-fixed": "var(--on-tertiary-fixed)",
        "on-tertiary-fixed-variant": "var(--on-tertiary-fixed-variant)",
        "background": "var(--background)",
        "on-background": "var(--on-background)",
        "surface-variant": "var(--surface-variant)",
        "slate-navy": "var(--slate-navy)",
        "border-subtle": "var(--border-subtle)",
        "surface-canvas": "var(--surface-canvas)",
        "surface-card": "var(--surface-card)",
        "brand-teal": "var(--brand-teal)",
        "status-success": "var(--status-success)",
        "status-warning": "var(--status-warning)",
        "status-error": "var(--status-error)",
        "status-info": "var(--status-info)",
        "relationship-identical": "var(--relationship-identical)",
        "relationship-duplicate": "var(--relationship-duplicate)",
        "relationship-near": "var(--relationship-near)",
      },
      borderRadius: {
        "none": "0",
        "sm": "0.25rem",    // 4px
        "DEFAULT": "0.5rem", // 8px (smoother than 2px)
        "md": "0.625rem",   // 10px
        "lg": "0.75rem",    // 12px
        "xl": "1rem",       // 16px
        "2xl": "1.25rem",   // 20px
        "3xl": "1.5rem",    // 24px
        "full": "9999px"
      },
      spacing: {
        "row-height-dense": "34px",
        "unit": "4px",
        "margin-page": "24px",
        "drawer-width-lg": "600px",
        "row-height-standard": "48px",
        "drawer-width-sm": "400px",
        "gutter": "16px"
      },
      fontFamily: {
        "display-cnmc": ["IBM Plex Sans", "sans-serif"],
        "headline-section": ["IBM Plex Sans", "sans-serif"],
        "data-mono": ["JetBrains Mono", "monospace"],
        "body-bold": ["IBM Plex Sans", "sans-serif"],
        "table-header": ["IBM Plex Sans", "sans-serif"],
        "body-standard": ["IBM Plex Sans", "sans-serif"],
        "label-caps": ["IBM Plex Sans", "sans-serif"]
      },
      fontSize: {
        "display-cnmc": ["24px", { lineHeight: "32px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "headline-section": ["18px", { lineHeight: "24px", fontWeight: "600" }],
        "data-mono": ["12px", { lineHeight: "16px", fontWeight: "400" }],
        "body-bold": ["13px", { lineHeight: "18px", fontWeight: "600" }],
        "table-header": ["12px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "600" }],
        "body-standard": ["13px", { lineHeight: "18px", fontWeight: "400" }],
        "label-caps": ["11px", { lineHeight: "14px", letterSpacing: "0.05em", fontWeight: "700" }]
      }
    }
  },
  plugins: [],
}
