/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        // legacy aliases kept for backwards compat
        background:    "#FFFFFF",
        backgroundTwo: "#F8FAFC",
        third:         "#FDFDFD",
        focus:         "#0F172A",
        secondary:     "#64748B",
        primary:       "#0F172A",
        header:        "#F1F5F9",
        // design-system tokens
        surface:       "#F1F5F9",
        accent:        "#6366F1",
        "accent-dark": "#4F46E5",
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


