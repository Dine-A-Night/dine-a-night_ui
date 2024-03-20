/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      zIndex: {
        1200: "1200",
      },
    },
  },
  plugins: [],
  important: true,
  preflight: false,
};
