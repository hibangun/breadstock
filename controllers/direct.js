var express         = require('express')
var User            = require('../models/user')
var Coupon          = require('../models/coupon')
var Product         = require('../models/product')
var Order           = require('../models/order')
var OrderItem       = require('../models/order-item')

var async           = require('async')
var uuid            = require('node-uuid')

var path            = require('path')
var validator       = require('validator')
var _               = require('lodash')
var moment          = require('moment')

var config          = require('../config')
var resHelper       = require('../helper/response')
var functionsHelper = require('../helper/functions')

var app             = express()

app.route('/generate-data')
.get(function(req, res, next) {
  var action = req.originalUrl

  res.render('direct', {
    title: 'Generate Data',
    action: action
  })
})
.post(function(req, res, next) {
  if(req.body.password !== config.diractPassword) {
    req.flash('error', 'Halaman tidak dapat diakses')
    return res.redirect('/alert')
  }

  async.parallel({
    removeAllDate: function(cb) {
      User.removeByQueries({}, function(){})
      Product.removeByQueries({}, function(){})
      Coupon.removeByQueries({}, function(){})
      Order.removeByQueries({}, function(){})
      OrderItem.removeByQueries({}, function(){})

      cb(null, 'removed')
    },
    superadmin: function(cb) {
      var data = {
        name: 'Breadstock',
        phone: '+6281229056667',
        email: 'mail.breadstock@gmail.com',
        address: 'Indonesia',
        password: '123',
        role: 'superadmin'
      }

      User.create(data, cb)
    },
    product: function(cb) {
      var data = [
        {
          image: '/images/bread-1.png',
          name: 'French Stick',
          price: 10000,
          amount: 0
        },
        {
          image: '/images/bread-2.png',
          name: 'Cafe Uno',
          price: 10000,
          amount: 200
        },
        {
          image: '/images/bread-3.png',
          name: 'Winter Hols',
          price: 10000,
          amount: 30
        },
      ]

      var products = []
      _.forEach(data, function(product, i) {
        products.push(function(pcb) {
          Product.create(product, pcb)
        })
      })

      async.parallel(products, cb)
    },
    coupon: function(cb) {
      var data = {
        startDate: moment(),
        endDate: moment().add(5, 'day').endOf('day'),
        amount: 10,
        percentage: 10,
        code: 'coupon'
      }

      Coupon.create(data, cb)
    }
  }, function(err, results) {
    if(err) {
      req.flash('error', 'There was a problem with the system, try again')
    } else {
      req.flash('success', 'Initial data has been created')
    }

    return res.redirect('/alert')
  })
})

module.exports = app;