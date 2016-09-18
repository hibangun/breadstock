var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var config    = require('../config')
var bcrypt    = require('bcrypt-nodejs')

var productSchema = new Schema({
  image: {
    type: String
  },
  name: {
    type: String
  },
  price: {
    type: Number
  },
  amount: {
    type: Number
  },
  status: {
    type: Number,
    default: 1 // 0 for inactive, 1 for active
  },
  create: {
    type: Date
  },
  update: {
    type: Date,
    default: Date.now
  }
})

productSchema.pre('save', function(next) {
  this.create = this._id.getTimestamp()

  next()
})

var Product = mongoose.model('Product', productSchema, 'product')

// remove product by query
exports.removeByQueries = function(queries, cb) {
  Product.remove(queries).exec(function(err, doc) {
    return cb(err, doc)
  })
}

// create new product
exports.create = function(data, cb) {
  data.create = new Date()

  var newDoc = new Product(data)
  newDoc.save(function(err, doc) {
    return cb(err, doc)
  })
}

// find one product by queries
exports.findByQueries = function(queries, cb) {
  Product
  .findOne(queries)
  .exec(function(err, doc) {
    return cb(err, doc)
  })
}

// find one product by queries
exports.findAllByQueries = function(queries, cb) {
  Product
  .find(queries)
  .exec(function(err, docs) {
    return cb(err, docs)
  })
}

// update one product by queueries
exports.updateByQueries = function(queries, data, cb) {
  data.update = new Date()

  Product
  .findOneAndUpdate(queries, data, {new: true})
  .exec(function(err, doc) {
    return cb(err, doc)
  })
}

// update some products by queries
exports.updateAllByQueries = function(queries, data, cb) {
  data.update = new Date()

  Product
  .update(queries, data, {multi: true})
  .exec(function(err, doc) {
    return cb(err, doc)
  })
}