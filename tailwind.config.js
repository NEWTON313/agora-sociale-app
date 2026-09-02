/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#10131a",
        "ink-soft": "#454e5e",
        "ink-faint": "#6b7280",
        paper: "#e8eaee",
        "paper-raised": "#ffffff",
        line: "#d8dce2",
        "line-strong": "#a7aeb9",
        populaires: { DEFAULT: "#3d5a78", bg: "#e2e8ee" },
        moyennes: { DEFAULT: "#566f4d", bg: "#e6ebe3" },
        aisees: { DEFAULT: "#7a4258", bg: "#eee2e6" },
        retraites: { DEFAULT: "#9c7539", bg: "#f1e8d7" },
        positif: "#326049",
        negatif: "#8f382f",
        "accent-bleu": { DEFAULT: "#1e3a5f", soft: "#395670" },
        "accent-rouge": "#8a2f35",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(16,19,26,0.05)",
        card: "0 2px 6px rgba(16,19,26,0.07), 0 1px 2px rgba(16,19,26,0.05)",
        elevated: "0 8px 24px rgba(16,19,26,0.10), 0 2px 6px rgba(16,19,26,0.06)",
        premium: "0 20px 48px rgba(16,19,26,0.16), 0 6px 16px rgba(16,19,26,0.08)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: { DEFAULT: "3px" },
    },
  },
  plugins: [],
};
