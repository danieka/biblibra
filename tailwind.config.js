module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {},
  variants: {
    extend: {
      opacity: ["disabled"],
      borderWidth: ["last"],
      borderRadius: ["last", "first"],
    },
  },
  plugins: [],
};
