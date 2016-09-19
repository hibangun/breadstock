var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var config    = require('../config')
var bcrypt    = require('bcrypt-nodejs')
var shortid   = require('shortid')

var orderSchema = new Schema({
  orderId: {
    type: String
  },
  name: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  address: {
    type: String
  },
  coupon: {
    type: Schema.ObjectId,
    ref : "Coupon",
  },
  status: {
    type: Number,
    default: 1 // 0 for inactive, 1 for order submitted, 2 for order accepted by admin
  },
  shippingCode: {
    type: String
  },
  totalItem: {
    type: Number
  },
  create: {
    type: Date
  },
  update: {
    type: Date,
    default: Date.now
  }
})

orderSchema.pre('save', function(next) {
  this.create = this._id.getTimestamp()
  this.orderId = shortid.generate().toLowerCase()

  next()
})

var Order = mongoose.model('Order', orderSchema, 'order')

// remove order by query
exports.removeByQueries = function(queries, cb) {
  Order.remove(queries).exec(function(err, doc) {
    return cb(err, doc)
  })
}

// create new order
exports.create = function(data, cb) {
  data.create = new Date()

  var newDoc = new Order(data)
  newDoc.save(function(err, doc) {
    return cb(err, doc)
  })
}

// find one order by queries
exports.findByQueries = function(queries, cb) {
  Order
  .findOne(queries)
  .populate('coupon')
  .exec(function(err, doc) {
    return cb(err, doc)
  })
}

// find one order by queries
exports.findAllByQueries = function(queries, cb) {
  Order
  .find(queries)
  .populate('coupon')
  .exec(function(err, docs) {
    return cb(err, docs)
  })
}

// update one order by queueries
exports.updateByQueries = function(queries, data, cb) {
  data.update = new Date()

  Order
  .findOneAndUpdate(queries, data, {new: true})
  .exec(function(err, doc) {
    return cb(err, doc)
  })
}

// update some order by queries
exports.updateAllByQueries = function(queries, data, cb) {
  data.update = new Date()

  Order
  .update(queries, data, {multi: true})
  .exec(function(err, doc) {
    return cb(err, doc)
  })
}