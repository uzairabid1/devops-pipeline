/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      this.important="#root",
      
    ],
    theme: {
      extend: {
        colors: {
          primary: "#50E9CB",
          secondary: {
            100: "#8173C9",
            200: "#10005F",
          },
        },
      },
    },
    plugins: [],
  }