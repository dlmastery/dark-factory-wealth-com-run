/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // EstateCompass palette — distinct from wealth.com's teal/forest brand
        // (HD-002 brand substitution). Slate primary + amber accents.
        compass: {
          50: "#f8fafc",
          100: "#f1f5f9",
          500: "#475569",
          700: "#334155",
          900: "#0f172a",
        },
        accent: {
          400: "#fbbf24",
          500: "#f59e0b",
        },
      },
      fontFamily: {
        display: ["ui-sans-serif", "system-ui", "Inter", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};
