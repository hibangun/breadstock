var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var config    = require('../config')
var bcrypt    = require('bcrypt-nodejs')

var orderItemSchema = new Schema({
  order: {
    type: Schema.ObjectId,
    ref : "order",
  },
  product: {
    type: Schema.ObjectId,
    ref : "product",
  },
  count: {
    type: Number
  },
  price: {
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

orderItemSchema.pre('save', function(next) {
  this.create = this._id.getTimestamp()

  next()
})

var OrderItem = mongoose.model('OrderItem', orderItemSchema, 'order_item')

// remove order item by query
exports.removeByQueries = function(queries, cb) {
  OrderItem.remove(queries).exec(function(err, doc) {
    return cb(err, doc)
  })
}

// create new order item
exports.create = function(data, cb) {
  data.create = new Date()

  var newDoc = new OrderItem(data)
  newDoc.save(function(err, doc) {
    return cb(err, doc)
  })
}

// find one order item by queries
exports.findByQueries = function(queries, cb) {
  OrderItem
  .findOne(queries)
  .populate('order')
  .populate('product')
  .exec(function(err, doc) {
    return cb(err, doc)
  })
}

// find one order by queries
exports.findAllByQueries = function(queries, cb) {
  Order
  .find(queries)
  .populate('order')
  .populate('product')
  .exec(function(err, docs) {
    return cb(err, docs)
  })
}

// update one order item by queueries
exports.updateByQueries = function(queries, data, cb) {
  data.update = new Date()

  OrderItem
  .findOneAndUpdate(queries, data, {new: true})
  .exec(function(err, doc) {
    return cb(err, doc)
  })
}

// update some order item by queries
exports.updateAllByQueries = function(queries, data, cb) {
  data.update = new Date()

  OrderItem
  .update(queries, data, {multi: true})
  .exec(function(err, doc) {
    return cb(err, doc)
  })
}