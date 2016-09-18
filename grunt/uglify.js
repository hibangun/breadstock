module.exports = {
  options: {
    //ASCIIOnly: true,
    //banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
    //compress: true,
    //mangle: true,
    //sourceMap: true,
    report: "min",
    compress: {
      dead_code: true
    }
  },

  indexApp: {
    src: 'public/javascripts/index/app.js',
    dest: 'public/javascripts/index/app.min.js'
  },
  indexPlugins: {
    src: 'public/javascripts/index/plugins.js',
    dest: 'public/javascripts/index/plugins.min.js'
  },

  dashboardApp: {
    src: 'public/javascripts/dashboard/app.js',
    dest: 'public/javascripts/dashboard/app.min.js'
  },
  dashboardPlugins: {
    src: 'public/javascripts/dashboard/plugins.js',
    dest: 'public/javascripts/dashboard/plugins.min.js'
  }
}