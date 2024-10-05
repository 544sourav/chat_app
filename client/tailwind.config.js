/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors:{
        'deepblue-100':'#3786F6',
        'deepblue-600':'#1E1E1E ',
        'deepblue-700':'#333B42',
        'deepblue-800':'#1D2125',
        'deepblue-900':'#161A1D ',
        
        'deepblue-1000':'#18191A',

        'tele-100':'#13A668',

      },
      fontFamily:{
        'pacifico':["Pacifico", 'cursive'],
        'inter':["Inter", 'sans-serif']
      }
    },
  },
  plugins: [],
}

