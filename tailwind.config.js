/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // https://stackoverflow.com/a/73798548/3075798
  safelist: [
    ...[...Array(30).keys()].flatMap((i) => `w-${i}`),
    ...[...Array(30).keys()].flatMap((i) => `h-${i}`),
  ],
};
