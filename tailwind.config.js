const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      menu: ["Lucidity Condensed Regular"],
      text: ["Poppins"]
    },
    extend: {
      colors: {
        trumpos: {
          page: "#211616",
          fontLight: "#e7c184",
          fontDark: "#82602a",
