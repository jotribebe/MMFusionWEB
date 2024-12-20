const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");
/*base: ['0.875rem', '1.225rem'],*/
/** @type {import('tailwindcss').Config} */
function withOpacity(variableName) {
  return `'rgb(var(${variableName}) / <alpha-value>)'`;
}

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,ts}"],
  theme: {
    fontSize: {
      "3xs": "0.5rem",
      "2xs": "0.6875rem",
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "2.5rem",
    },
    extend: {
      colors: {
        green: {
          700: "#243939",
          600: "#107f39",
          500: "#334f4e",
          400: "#3d6c6b",
          300: "#177876",
          200: "#2f8333",
          50: "#a4ed06",
        },
        onyx: {
          700: "#000000",
          600: "#12110f",
          500: "#2c2a26",
          400: "#252c1a",
          300: "#60684c",
        },
        gray: {
          700: "#181818",
          600: "#363636",
          500: "#4c4c4c",
          300: "#bbbdbe",
          200: "#eeefe2",
          100: "#f4f4f1",
          50: "#ffffff",
        },
        red: {
          500: "#d32f2f",
          50: "#fff5f5",
        },
        blue: {
          500: "#0095e7",
        },
        orange: {
          400: "#ff9800",
        },
        brown: {
          500: "#986801",
        },
        custom: {
          grayblue: "#BBBDBE",
        },
      },
      fontFamily: {
        sans: ['"Segoe UI"', ...defaultTheme.fontFamily.sans],
      },
      textColor: {
        skin: {
          base: withOpacity("--color-text-base"),
          muted: withOpacity("--color-text-muted"),
          inverted: withOpacity("--color-inverted"),
        },
      },
      lineHeight: {
        tight: "1.2",
      },
      backgroundColor: {
        skin: {
          base: withOpacity("--color-base"),
          fill: withOpacity("--color-fill"),
          inverted: withOpacity("--color-inverted"),
          sidebar: withOpacity("--color-sidebar"),
          header: withOpacity("--color-header"),
          login: withOpacity("--color-login"),
          textarea: withOpacity("--color-textarea"),
          primary: withOpacity("--color-primary"),
          "primary-hover": withOpacity("--color-primary-hover"),
          disabled: withOpacity("--color-disabled"),
          secondary: withOpacity("--color-secondary"),
          "secondary-hover": withOpacity("--color-secondary-hover"),
          light: withOpacity("--color-light"),
        },
      },
      borderColor: {
        skin: {
          base: withOpacity("--color-border-base"),
          inverted: withOpacity("--color-border-inverted"),
        },
      },
      gradientColorStops: {
        skin: {
          hue: withOpacity("--color-fill"),
        },
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar")({ nocompatible: true }),
    plugin(function ({ addBase, theme }) {
      addBase({
        html: {
          lineHeight: "1.4",
        },
      });
    }),
  ],
};
