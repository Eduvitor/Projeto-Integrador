/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: theme => ({
        'custom-image': "url('../public/big-rice-field-morning-thailand.jpg')",
      })
    }
  },
  plugins: [],
}

