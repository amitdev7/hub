import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mac: {
          close: "#FF5F56",
          minimize: "#FFBD2E",
          expand: "#27C93F",
          sidebar: "rgba(246, 246, 248, 0.75)",
          "sidebar-dark": "rgba(22, 24, 30, 0.75)",
          surface: "rgba(255, 255, 255, 0.85)",
          "surface-dark": "rgba(30, 33, 42, 0.85)",
        },
        stripe: {
          blue: "#635BFF",
          "blue-dark": "#4B44DB",
          cyan: "#00D4FF",
          slate: "#0A2540",
          muted: "#425466",
        },
      },
      boxShadow: {
        "mac-window": "0 25px 50px -12px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(15, 23, 42, 0.08)",
        "mac-window-dark": "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)",
        "mac-card": "0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.03)",
        "mac-float": "0 10px 30px -10px rgba(0, 0, 0, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.04)",
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        "mac-window": "18px",
      },
    },
  },
  plugins: [],
};

export default config;
