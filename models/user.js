var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var config    = require('../config')
var bcrypt    = require('bcrypt-nodejs')

var userSchema = new Schema({
  name: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String,
    uniqe: true,
    dropDups: true,
    lowercase: true
  },
  address: {
    type: String
  },
  password: {
    type: String
  },
  role: {
    type: String,
    enum: ['customer', 'superadmin']
  },
  // User status   : 0 > deleted, 1 > active
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
  },
  lastLogin: {
    type: Date
  }
})

userSchema.pre('save', function(next) {
  this.create = this._id.getTimestamp()

  next()
})

var User = mongoose.model('User', userSchema, 'user')

// remove user by query
exports.removeByQueries = function(queries, cb) {
  User.remove(queries).exec(function(err, doc) {
    return cb(err, doc)
  })
}

// generating a hash
exports.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

// checking if password is valid
exports.validPassword = function(password, passwordDB) {
  return bcrypt.compareSync(password, passwordDB)
}

// create new user
exports.create = function(data, cb) {
  data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(8), null)
  data.create = new Date()

  var newDoc = new User(data)
  newDoc.save(function(err, doc) {
    return cb(err, doc)
  })
}

// find one user by queries
exports.findByQueries = function(queries, cb) {
  User
  .findOne(queries)
  .exec(function(err, docs) {
    return cb(err, docs)
  })
}

// find one user by queries
exports.findAllByQueries = function(queries, cb) {
  User
  .find(queries)
  .exec(function(err, docs) {
    return cb(err, docs)
  })
}

// update one user by queueries
exports.updateByQueries = function(queries, data, cb) {
  data.update = new Date()

  User
  .findOneAndUpdate(queries, data, {new: true})
  .exec(function(err, doc) {
    return cb(err, doc)
  })
}

// update some users by queries
exports.updateAllByQueries = function(queries, data, cb) {
  data.update = new Date()

  User
  .update(queries, data, {multi: true})
  .exec(function(err, doc) {
    return cb(err, doc)
  })
}