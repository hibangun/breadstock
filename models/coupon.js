var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var config    = require('../config')

var couponSchema = new Schema({
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  amount: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number
  },
  code: {
    type: String
  },
  status: {
    type: Number,
    default: 1
  },
  create: {
    type: Date
  },
  update: {
    type: Date,
    default: Date.now
  }
})

couponSchema.pre('save', function(next) {
  this.create = this._id.getTimestamp()
  this.code = this.code.toLowerCase()

  next()
})

var Coupon = mongoose.model('Coupon', couponSchema, 'coupon')

// remove coupon by query
exports.removeByQueries = function(queries, cb) {
  Coupon.remove(queries).exec(function(err, doc) {
    return cb(err, doc)
  })
}

// create new coupon
exports.create = function(data, cb) {
  data.create = new Date()

  var newData = new Coupon(data)
  newData.save(function(err, doc) {
    return cb(err, doc)
  })
}

// find one coupon by queries
exports.findByQueries = function(queries, cb) {
  Coupon
  .findOne(queries)
  .populate('site')
  .exec(function(err, doc) {
    return cb(err, doc)
  })
}

// find one coupon by queries
exports.findAllByQueries = function(queries, cb) {
  Coupon
  .find(queries)
  .populate('site')
  .exec(function(err, docs) {
    return cb(err, docs)
  })
}

// update one coupon by queueries
exports.updateByQueries = function(queries, data, cb) {
  data.update = new Date()

  Coupon
  .findOneAndUpdate(queries, data, {new: true})
  .exec(function(err, doc) {
    return cb(err, doc)
  })
}

// update some coupons by queries
exports.updateAllByQueries = function(queries, data, cb) {
  data.update = new Date()

  Coupon
  .update(queries, data, {multi: true})
  .exec(function(err, doc) {
    return cb(err, doc)
  })
}