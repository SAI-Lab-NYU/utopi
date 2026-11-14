import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        paper: "#f6f4ef",
        ink: "#111111",
        line: "#d8d5cc",
        muted: "#6d6a63",
        cool: "#3858ff",
        warm: "#e6502f"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: [
          "var(--font-space-grotesk)",
          "Space Grotesk",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif"
        ]
      },
      boxShadow: {
        hairline: "inset 0 0 0 1px rgba(17,17,17,0.08)"
      }
    }
  },
  plugins: []
};

export default config;
