var mongoose = require('mongoose')
var config   = require('../config')

var dbUrl = 'mongodb://'
dbUrl += config.db.username + ':' + config.db.password + '@'
dbUrl += config.db.host + ':' + config.db.port
dbUrl += '/' + config.db.db

var connect = function () {
  var options = {
    server: {
      socketOptions: { keepAlive: 1 }
    },
    auto_reconnect:true
  }
  mongoose.connect(dbUrl, options)
}

mongoose.Promise = global.Promise
mongoose.connect(dbUrl)

mongoose.connection.on('error', function (err) {
  console.log(err)
  connect()
})

// Reconnect when closed
mongoose.connection.on('disconnected', function () {
  connect()
})
