/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        secondary: "#637381",
        gray900: "#2B3445",
        neutral: "#F4F6F8",
        success: "#118D57",
        green: "#00A76F",
        green16: "#22C55E29",
        light: "#919EAB",
        light20: "#919EAB33",
        red: "#FF0000",
        red20: "#C55D2229",
        dark: "#1E232C"
      },
    },
  },
  plugins: [
    ({ addComponents }) => {
      addComponents({
        ".container": {
          "@apply mx-auto": {},
          "@apply px-4": {},
        },
        ".container-md": {
          "@apply max-w-[1228px]": {},
          "@apply mx-auto": {},
        },
      });
    },
  ],
};
