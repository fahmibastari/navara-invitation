// tailwind.config.ts
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navara: {
          violet: "#6A0DAD",
          white: "#FFFFFF",
          royal: "#4B56D2",
          sky: "#4AC7F0",
        },
      },
      fontFamily: {
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
        hind: ["var(--font-hind)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 45px rgba(0,0,0,0.10)",
      },
      borderRadius: {
        xl2: "1.5rem",
      },
    },
  },
  plugins: [],
}

export default config
