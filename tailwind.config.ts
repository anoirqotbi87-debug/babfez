import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Exact babfez.com fonts
        sans: ["var(--font-jakarta)", "DM Sans", "sans-serif"],
        serif: ["var(--font-playfair)", "Libre Baskerville", "serif"],
        jakarta: ["var(--font-jakarta)", "sans-serif"],
        playfair: ["var(--font-playfair)", "serif"],
        cairo: ["var(--font-cairo)", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Exact babfez.com palette from CSS variables
        sage: {
          DEFAULT: "#A1C0BA",   // --e-global-color-primary
          dark: "#6F8E88",      // --e-global-color-secondary (titres)
          medium: "#63968C",    // --e-global-color-0264f57
          light: "#EAF3F1",     // Dérivé clair
        },
        blush: {
          DEFAULT: "#EAC6B8",   // --e-global-color-accent (rose saumon)
          dark: "#D4A898",
        },
        neutral: {
          bg: "#F2F2F2",        // theme-color babfez.com
          white: "#FFFFFF",
          text: "#646767",      // --e-global-color-text
          border: "#E0E0E0",
        },
        // Keep gold for accents
        gold: {
          DEFAULT: "#C59B27",
          royal: "#D4AF37",
        },
      },
      boxShadow: {
        sage: "0 10px 30px -10px rgba(111, 142, 136, 0.12)",
        "sage-lg": "0 20px 40px -15px rgba(111, 142, 136, 0.18)",
        card: "0 2px 20px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
