/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app/**/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        grey: {
          100: "#1F1F1F",
          200: "#5E5E5E",
        },
        green: {
          100: "#9CDE00"
        }
      },
      fontSize: {
        title: "36px",
        subtitle: "24px",
        button: "20px"
      },
    },
  },
  plugins: [],
};
