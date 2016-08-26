module.exports = {
  // See http://brunch.io for documentation.
  files: {
    javascripts: {joinTo: 'app.js'},
    stylesheets: {joinTo: 'app.css'},
  },
  plugins: {
    brunchTypescript: {
      removeComments: true
    },
    postcss: {
      processors: [
        require('precss')({ /* options */ }),
        require('postcss-short')({ /* options */ }),
        require('autoprefixer')(['last 8 versions'])
      ]
    }
  }
}
