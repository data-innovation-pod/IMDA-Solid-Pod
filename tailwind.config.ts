import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      backgroundImage: {
        "empty-profile": "url('/images/empty-profile-picture.png')",
      },
      colors: {
        blue: {
          light: "#eff6fc",
        },
        purple: {
          dark: "#6F358E",
          light: "#e2d7e8",
        },
        grey: {
          light: "#F5F5F5",
          "medium-light": "#BDBDBD",
          dark: "#2E2E3C",
          border: "#D1D1D1",
          line: "#616161",
          default: "#605E5C",
          bckgrd: "#E0E0E0",
        },
        text: {
          dark: "#242424",
          light: "#424242",
          lightest: "#605E5C",
          link: "#115EA3",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      maxWidth: {
        "detail-column": "300px",
        sidebar: "250px",
      },
      minWidth: {
        "detail-column": "220px",
        sidebar: "170px",
      },
      width: {
        "90": "360px",
      },
    },
  },
  plugins: [],
} satisfies Config;
