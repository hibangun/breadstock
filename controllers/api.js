var express         = require('express')
var User            = require('../models/user')
var Product         = require('../models/product')
var Coupon          = require('../models/coupon')
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

app.route('/breads')
.get(function(req, res, next) {
  Product.findAllByQueries({'status': 1}, function(err, docs) {
    if(err) {
      return resHelper.responseServerError(res, {message: 'There was problem with the system. Try again.'})
    } else {
      return resHelper.responseSuccess(res, docs)
    }
  })
})

app.route('/breads/check/:productId')
.get(function(req, res, next) {
  var productId = req.params.productId

  Product.findByQueries({'_id': productId}, function(err, docs) {
    if(err) {
      return resHelper.responseServerError(res, {message: 'There was problem with the system. Try again.'})
    } else {
      return resHelper.responseSuccess(res, docs)
    }
  })
})

app.route('/coupon/check/:code')
.get(function(req, res, next) {
  var code = req.params.code.toLowerCase()

  Coupon.findByQueries({'code': code, 'endDate': {$gte: new Date()}, 'startDate': {$lte: new Date()}}, function(err, doc) {
    if(err) {
      return resHelper.responseServerError(res, {message: 'There was problem with the system. Try again.'})
    } else {
      return resHelper.responseSuccess(res, doc || {})
    }
  })
})

app.route('/orders')
.get(function(req, res, next) {
  Order.findAllByQueries({}, function(err, docs) {
    if(err) {
      return resHelper.responseServerError(res, {message: 'There was problem with the system. Try again.'})
    } else {
      return resHelper.responseSuccess(res, docs)
    }
  })
})

app.route('/orders/:orderId')
.get(function(req, res, next) {
  var orderId = req.params.orderId

  async.parallel({
    order: function(cb) {
      Order.findByQueries({'_id': orderId}, cb)
    },
    orderItem: function(cb) {
      OrderItem.findAllByQueries({'order': orderId}, cb)
    }
  }, function(err, results) {
    if(err) {
      return resHelper.responseServerError(res, {message: 'There was problem with the system. Try again.'})
    } else {
      return resHelper.responseSuccess(res, results || {})
    }
  })
})

app.route('/order/add')
.post(function(req, res, next) {
  var data = req.body
  var orderId = ''

  if(data.coupon !== '') {
    Coupon.findByQueries({'_id': data.coupon}, function(err, result) {
      if(!err && result) {
        var amoutLeft = result.amount - 1
        Coupon.updateByQueries({'_id': data.coupon}, {'amount': amoutLeft}, function(err, result){})
      }
    })
  } else {
    delete data.coupon
  }

  async.waterfall([
    function(cb) {
      Order.create(data, cb)
    },
    function(order, cb) {
      orderId = order.orderId
      var items = JSON.parse(data.items)

      var orderItems = []
      _.forEach(items, function(item, i) {
        Product.findByQueries({'_id': item.product}, function(err, result) {
          if(!err && result) {
            var amoutLeft = result.amount - item.count
            Product.updateByQueries({'_id': item.product}, {'amount': amoutLeft}, function(err, result){})
          }
        })
        orderItems.push(function(ocb) {
          item.order = order._id
          OrderItem.create(item, ocb)
        })
      })

      async.parallel(orderItems, cb)
    }
  ], function(err, results) {
    if(err) {
      return resHelper.responseServerError(res, {message: 'There was problem with the system. Try again.'})
    } else {
      return resHelper.responseSuccess(res, {orderId: orderId})
    }
  })
})

app.route('/order/check/:orderId')
.get(function(req, res, next) {
  var orderId = req.params.orderId

  Order.findByQueries({'orderId': orderId}, function(err, doc) {
    console.log(err, doc);
    if(err) {
      return resHelper.responseServerError(res, {message: 'There was problem with the system. Try again.'})
    } else {
      return resHelper.responseSuccess(res, doc || {})
    }
  })
})

app.route('/order/shipping')
.post(function(req, res, next) {
  var oid = req.body.oid

  console.log(req.body);
  Order.updateByQueries({'_id': oid}, {'shippingCode': req.body.shippingCode, 'status': 2}, function(err, doc) {
    if(err) {
      return resHelper.responseServerError(res, {message: 'There was problem with the system. Try again.'})
    } else {
      return resHelper.responseSuccess(res, doc || {})
    }
  })
})

module.exports = app;