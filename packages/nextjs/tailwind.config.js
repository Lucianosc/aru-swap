/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "dark",
  darkMode: ["selector", "[data-theme='dark']"],
  daisyui: {
    themes: [
      {
        light: {
          primary: "rgb(87, 139, 250)",
          "primary-content": "#1a1b1f",
          secondary: "#DAE8FF",
          "secondary-content": "#1a1b1f",
          accent: "rgb(87, 139, 250)",
          "accent-content": "#1a1b1f",
          neutral: "#1a1b1f",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f4f8ff",
          "base-300": "#DAE8FF",
          "base-content": "#1a1b1f",
          info: "rgb(87, 139, 250)",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",
          "--rounded-btn": "9999rem",
        },
      },
      {
        dark: {
          primary: "rgb(87, 139, 250)",
          "primary-content": "#ffffff",
          secondary: "rgba(87, 139, 250, 0.2)",
          "secondary-content": "#ffffff",
          accent: "rgba(87, 139, 250, 0.4)",
          "accent-content": "#ffffff",
          neutral: "#ffffff",
          "neutral-content": "#1a1b1f",
          "base-100": "#1a1b1f",
          "base-200": "rgba(17, 18, 21, 0.8)",
          "base-300": "rgba(24, 25, 29, 0.5)",
          "base-content": "#ffffff",
          info: "rgb(87, 139, 250)",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",
          "--rounded-btn": "9999rem",
        },
      },
    ],
  },
  theme: {
    extend: {
      colors: {
        blue: {
          500: "rgb(87, 139, 250)",
        },
      },
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
        glow: "0 0 20px -5px rgb(87 139 250 / 0.25)",
      },
      keyframes: {
        glow: {
          "0%": { backgroundColor: "rgba(255, 255, 255, 0)" },
          "50%": { backgroundColor: "rgba(255, 255, 255, 0.05)" },
          "100%": { backgroundColor: "rgba(255, 255, 255, 0)" },
        },
      },
      animation: {
        glow: "glow 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
};
