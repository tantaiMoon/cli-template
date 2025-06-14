module.exports = {
  // plugins: {
  //   // tailwindcss: {},
  //   autoprefixer: {},
  //   '@unocss/postcss': {}
  // }
  plugins: [require('autoprefixer')(), require('@unocss/postcss')({})]
}
