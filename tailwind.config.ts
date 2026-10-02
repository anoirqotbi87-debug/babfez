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
        sans: ["var(--font-jakarta)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
        jakarta: ["var(--font-jakarta)", "sans-serif"],
        playfair: ["var(--font-playfair)", "serif"],
        cairo: ["var(--font-cairo)", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        terracotta: {
          DEFAULT: "#B85D36",
          dark: "#A04E2B",
          light: "#FDF4EE",
        },
        gold: {
          DEFAULT: "#C59B27",
          royal: "#D4AF37",
          light: "#FCF8E3",
        },
        cream: {
          50: "#FDFBF7",
          100: "#FBF9F5",
          200: "#F5F0E8",
        },
        charcoal: {
          DEFAULT: "#1C1917",
          muted: "#44403C",
          soft: "#78716C",
        },
        borderWarm: "#E7DDD3",
      },
      boxShadow: {
        warm: "0 10px 30px -10px rgba(184, 93, 54, 0.08)",
        'warm-lg': "0 20px 40px -15px rgba(184, 93, 54, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
