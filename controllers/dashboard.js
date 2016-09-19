var express         = require('express');
var User            = require('../models/user');
var Product         = require('../models/product');

var moment          = require('moment')
var passport        = require('passport')

var config          = require('../config');
var resHelper       = require('../helper/response');
var functionsHelper = require('../helper/functions');
var Mailer          = require('../helper/mail');
var config          = require('../config');

var app             = express();

app.route('/')
.all(function(req, res, next) {
  if(!req.isAuthenticated() || req.user.role !== 'superadmin') {
    req.flash('error', 'Can\'t access the page');
    return res.redirect('/login');
  }

  return next();
})
.get(function(req, res, next) {
  return res.render('dashboard/index', {
    css: ['dashboard/app.css'],
    scripts: ['dashboard/plugins.js', 'dashboard/app.js']
  })
})

module.exports = app;