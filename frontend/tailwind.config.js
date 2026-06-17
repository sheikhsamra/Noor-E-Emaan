/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#004d40',
        accent: '#ffc107',
        background: '#f9f5f0',
      }
    }
  },
  plugins: [],
};
