/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#10131a",
        "ink-soft": "#454e5e",
        "ink-faint": "#6b7280",
        paper: "#f6f4ef",
        "paper-deep": "#ece9e1",
        "paper-raised": "#ffffff",
        line: "#e4e0d6",
        "line-strong": "#bcb6a8",
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
        xs: "0 1px 2px rgba(40,34,20,0.05)",
        card: "0 1px 2px rgba(40,34,20,0.04), 0 8px 24px -8px rgba(40,34,20,0.10)",
        elevated: "0 2px 4px rgba(40,34,20,0.05), 0 18px 40px -12px rgba(40,34,20,0.18)",
        premium: "0 4px 8px rgba(40,34,20,0.05), 0 30px 60px -20px rgba(40,34,20,0.22)",
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
