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
.get(function(req, res, next) {
  return res.render('index', {
    css: ['index/app.css'],
    scripts: ['index/plugins.js', 'index/app.js']
  })
})

app.route('/alert')
.get(function(req, res, next) {
  res.render('alert', {
    title: 'Alert Message',
    css: ['index/alert.css']
  })
})

app.route('/order')
.get(function(req, res, next) {
  var orderId = req.query.id

  return res.render('order', {
    css: ['index/app.css'],
    scripts: ['index/plugins.js', 'index/app.js'],
    orderId: orderId
  })
})

app.route('/login')
.get(function(req, res, next) {
  res.render('login', {
    title: 'Log in',
    css: ['index/app.css']
  })
})
.post(passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

module.exports = app;