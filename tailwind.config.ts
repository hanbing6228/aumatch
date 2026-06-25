import type { Config } from "tailwindcss";

// Palette mirrors the AuMatch design system: deep navy + brushed gold on warm cream.
const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1c3a5e",
          deep: "#14283f",
          darker: "#101f31",
          mid: "#21405f",
        },
        gold: {
          DEFAULT: "#b1812f",
          light: "#c79a45",
          pale: "#d8b878",
          solid: "#d1b069",
        },
        cream: {
          DEFAULT: "#f7ecda",
          light: "#fffaf2",
          panel: "#fdf7ec",
          deep: "#ecd9b2",
        },
        ink: {
          DEFAULT: "#36291a",
          soft: "#6f6450",
          faint: "#897c64",
        },
        danger: "#a23b2d",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "'Noto Serif SC'", "Georgia", "serif"],
        sans: ["var(--font-sans)", "'Noto Sans SC'", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1240px",
      },
    },
  },
  plugins: [],
};

export default config;
