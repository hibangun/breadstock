module.exports = {
  exceptPublic: {
    files: [
      "*",
      "!public/*"
    ],
    tasks: [
      "nodemon"
    ]
  },
  indexJS: {
    files: [
      "public/javascripts/index/app/*",
      "public/javascripts/index/plugins/*"
    ],
    tasks: [
      "concat:indexApp",
      "concat:indexPlugins"
    ]
  },
  dashboardJS: {
    files: [
      "public/javascripts/dashboard/app/*",
      "public/javascripts/dashboard/plugins/*"
    ],
    tasks: [
      "concat:dashboardApp",
      "concat:dashboardPlugins"
    ]
  },

  indexCSS: {
    files: [
      "public/stylesheets/index/app/*",
      "public/stylesheets/index/plugins/*"
    ],
    tasks: [
      "stylus:index",
      "autoprefixer:index",
      "cssmin"
    ]
  },
  dashboardCSS: {
    files: [
      "public/stylesheets/dashboard/app/*",
      "public/stylesheets/dashboard/plugins/*"
    ],
    tasks: [
      "stylus:dashboard",
      "autoprefixer:dashboard",
      "cssmin"
    ]
  }
}