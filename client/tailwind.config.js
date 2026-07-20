/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Make sure ts and tsx are included here!
  ],
  // Design tokens (colors, fonts) now live in src/index.css via the
  // Tailwind v4 @theme directive — see the "Signal" identity block there.
  theme: {
    extend: {},
  },
  plugins: [],
}