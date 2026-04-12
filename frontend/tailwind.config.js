/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef5ff",
          100: "#dceaff",
          500: "#3578ff",
          600: "#1f5be0",
          700: "#1a49b7"
        },
        surface: {
          DEFAULT: "#ffffff",
          dark: "#101828"
        }
      },
      boxShadow: {
        panel: "0 12px 38px -18px rgba(15, 23, 42, 0.35)",
        "panel-dark": "0 18px 45px -28px rgba(3, 6, 23, 0.75)"
      },
      backgroundImage: {
        "mesh-light":
          "radial-gradient(65% 60% at 10% 0%, rgba(53,120,255,0.18), transparent 58%), radial-gradient(45% 45% at 100% 0%, rgba(12,197,204,0.12), transparent 56%)",
        "mesh-dark":
          "radial-gradient(60% 55% at 10% 0%, rgba(53,120,255,0.2), transparent 60%), radial-gradient(45% 50% at 100% 0%, rgba(56,189,248,0.16), transparent 62%)"
      }
    }
  },
  plugins: []
};
