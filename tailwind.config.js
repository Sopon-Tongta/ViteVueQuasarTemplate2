/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      "prompt-black": "Prompt-Black",
      "prompt-black-italic": "Prompt-BlackItalic",
      "prompt-bold": "Prompt-Bold",
      "prompt-bold-italic": "Prompt-BoldItalic",
      "prompt-extrabold": "Prompt-ExtraBold",
      "prompt-extrabold-italic": "Prompt-ExtraBoldItalic",
      "prompt-extralight": "Prompt-ExtraLight",
      "prompt-extralight-italic": "Prompt-ExtraLightItalic",
      "prompt-italic": "Prompt-Italic",
      "prompt-light": "Prompt-Light",
      "prompt-medium": "Prompt-Medium",
      "prompt-medium-italic": "Prompt-MediumItalic",
      "prompt-regular": "Prompt-Regular",
      "prompt-semibold": "Prompt-SemiBold",
      "prompt-semibold-italic": "Prompt-SemiBoldItalic",
      "prompt-thin": "Prompt-Thin",
      "prompt-thin-italic": "Prompt-ThinItalic",
    },
    extend: {
      colors: {
        "theme-color": "themeColor",
      },
    },
  },
  plugins: [],
};
