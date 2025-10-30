/** @type {import('tailwindcss').Config} */
const {nextui} = require("@nextui-org/react");
module.exports = {
  content: [
    "./src/**/*.{ts,tsx,js,jsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'darker': 'rgba(20,20,32,1)',
        'darker-alpha': 'rgba(20,20,32,0.4)',
        'primary-alpha': 'rgba(140,86,255,0.2)',
        'primary': '#8C56FF',
      }
    },
  },
  plugins: [nextui()],
}

