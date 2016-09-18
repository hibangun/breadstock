module.exports = {
  indexApp: {
    options: {
      separator: ";"
    },
    src: [
      "public/javascripts/index/app/*.js"
    ],
    dest: "public/javascripts/index/app.js"
  },
  indexPlugins: {
    src: [
      "public/javascripts/index/plugins/*.js"
    ],
    dest: "public/javascripts/index/plugins.js"
  },

  dashboardApp: {
    options: {
      separator: ";"
    },
    src: [
      "public/javascripts/dashboard/app/*.js"
    ],
    dest: "public/javascripts/dashboard/app.js"
  },
  dashboardPlugins: {
    src: [
      "public/javascripts/dashboard/plugins/*.js",
    ],
    dest: "public/javascripts/dashboard/plugins.js"
  }
}