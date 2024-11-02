/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkCopper: "#292421",
        copper: "#A75F37",
        pink: "#CA8E82",
        tan: "#D9B99F",
        blush: "#F2D6C3",
        vanilla: "#F2E7DD",
        green: "#7A958F",
        mint: "#BAE0DA",
      },
    },
  },
  plugins: [],
};
