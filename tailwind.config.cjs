/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        coinbase: {
          blue: '#0052FF',
          lightBlue: '#E6F0FF',
          dark: '#0D1421',
        }
      }
    },
  },
  plugins: [],
}
