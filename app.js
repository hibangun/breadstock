var express         = require('express')
var path            = require('path')
var favicon         = require('serve-favicon')
var logger          = require('morgan')
var cookieParser    = require('cookie-parser')
var bodyParser      = require('body-parser')
var passport        = require('passport')
var LocalStrategy   = require('passport-local').Strategy
var session         = require('express-session');
var flash           = require('connect-flash')
var helpers         = require('view-helpers')
var validator       = require('validator')
var moment          = require('moment')
var _               = require('lodash')

var index          = require('./controllers/index')
var dashboard      = require('./controllers/dashboard')
var api            = require('./controllers/api')
var direct         = require('./controllers/direct')

var functionsHelper = require('./helper/functions')

var DB              = require('./models/db')
var User            = require('./models/user')
var config          = require('./config')
var pkg             = require('./package.json')

var port            = process.env.PORT || 3000

var app             = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(session({
  secret: 'breadbreadstock',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(helpers(pkg.name));

app.use(function(req, res, next) {
  res.locals.isLoggedIn       = req.isAuthenticated()
  res.locals.fullUrl          = req.protocol + "://" + req.get('host') + req.url
  res.locals.validator        = validator
  res.locals.moment           = moment
  res.locals._                = _
  res.locals.pkg              = pkg
  res.locals.user             = _.result(req.session.passport, 'user') ? req.session.passport.user : {}
  res.locals.price            = config.price
  res.locals.domain           = config.domain
  res.locals.payment          = config.payment
  res.locals.env              = app.get('env')
  res.locals.isFromMobile     = functionsHelper.isFromMobile(req)
  res.locals.capitalize       = function(str) {
    return functionsHelper.capitalize(str)
  }
  res.locals.currency         = function(str) {
    functionsHelper.capitalize(str)
  }

  res.locals.stylesheets      = []
  res.locals.addStylesheets   = function (all) {
    res.locals.stylesheets = []
    if(all != undefined) {
      return all.map(function(stylesheet) {
        if(stylesheet.indexOf('http') === -1) {
          if(app.get('env') !== 'development') {
            stylesheet = stylesheet.replace(/.css/g, ".min.css")
          }

          return "<link rel='stylesheet' href='/stylesheets/"+stylesheet+"' />"
        } else {
          return "<link rel='stylesheet' href='"+stylesheet+"' />"
        }
      }).join('\n ')
    }
    else {
      return ''
    }
  }
  res.locals.getStylesheets = function(req, res) {
    return stylesheets
  }

  res.locals.scripts = []
  res.locals.addScripts = function (all) {
    res.locals.scripts = []
    if(all != undefined) {
      return all.map(function(script) {
        if(app.get('env') !== 'development') {
          script = script.replace(/.js/g, ".min.js")
        }

        return "<script src='/javascripts/" + script + "'></script>"
      }).join('\n ')
    }
    else {
      return ''
    }
  }
  res.locals.getScripts = function(req, res) {
    return scripts
  }

  res.locals.getUuid = function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
  }

  next()
})

app.use(function(req, res, next) {
  var header                = config.header
  res.locals.title          = header.title
  res.locals.titleMeta      = header.titleMeta
  res.locals.desc           = header.desc
  next()
})

app.use(express.static(path.join(__dirname, 'public')))

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    User.findByQueries({'email': email}, function(err, user) {
      if (err) { return done(err); }

      if (!user) {
        return done(null, false, { message: 'Wrong email or password.' });
      }
      if (!User.validPassword(password, user.password)) {
        return done(null, false, { message: 'Wrong email or password.' });
      }

      if(user) {
        User.updateByQueries({'_id': user._id}, {'lastLogin': new Date()}, function(){})
      }

      return done(null, user);
    });
  }
));

app.use('/dashboard', dashboard)
app.use('/api', api)
app.use('/direct', direct)
app.use('/', index)

app.use(function(req, res, next){
  res.status(404)

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', {
      title: "Bridestock / ?",
      titleMeta: "Bridestock / ?",
      desc: config.header.desc
    })

    return
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' })
    return
  }

  // default to plain-text. send()
  res.type('txt').send('Not found')
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

app.listen(port, function() {
  console.log('\nReady to go! Let\'s start this port: ' + port)
})

module.exports = app
