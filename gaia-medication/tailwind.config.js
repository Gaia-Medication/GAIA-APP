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
          300: "#363636"
        },
        green: {
          100: "#9CDE00"
        }
      },
      fontFamily: {
        example: ["Varela"],
      },
      fontSize: {
        title: "32px",
        subtitle: "24px",
        button: "20px"
      },
    },
  },
  plugins: [],
};
