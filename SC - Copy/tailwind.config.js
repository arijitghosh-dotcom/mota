/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mota: {
          blue: "#0A2540",
          saffron: "#FF9933",
          green: "#138808",
          navy: "#001F3F",
          gold: "#D4AF37",
          lightBg: "#F4F7FA",
          cardBorder: "#E2E8F0"
        }
      }
    },
  },
  plugins: [],
}
