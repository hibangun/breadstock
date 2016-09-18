exports.responseSuccess = function(res, obj) {
  var resultPrint     = {}
  resultPrint.id      = require('node-uuid').v4()
  resultPrint.status  = 200
  resultPrint.message = obj.resMessage || 'success'
  resultPrint.data    = obj

  res.status(resultPrint.status).json(resultPrint)
}

exports.responseNotExist = function(res, obj) {
  var resultPrint     = {}
  resultPrint.id      = require('node-uuid').v4()
  resultPrint.status  = 404
  resultPrint.message = obj.resMessage || 'not exist'
  resultPrint.data    = obj

  res.status(resultPrint.status).json(resultPrint)
}

exports.responseTooLarge = function(res, obj) {
  var resultPrint     = {}
  resultPrint.id      = require('node-uuid').v4()
  resultPrint.status  = 413
  resultPrint.message = obj.resMessage || 'File you upload is too large'
  resultPrint.data    = obj

  res.status(resultPrint.status).json(resultPrint)
}

exports.responseServerError = function(res, obj) {
  var resultPrint     = {}
  resultPrint.id      = require('node-uuid').v4()
  resultPrint.status  = 500
  resultPrint.message = obj.resMessage || 'Something went wrong'
  resultPrint.data    = obj

  res.status(resultPrint.status).json(resultPrint)
}

exports.responseNotAcceptable = function(res, obj) {
  var resultPrint     = {}
  resultPrint.id      = require('node-uuid').v4()
  resultPrint.status  = 406
  resultPrint.message = obj.resMessage || 'File you upload is not acceptable'
  resultPrint.data    = obj

  res.status(resultPrint.status).json(resultPrint)
}

exports.responseNotModified = function(res, obj) {
  var resultPrint     = {}
  resultPrint.id      = require('node-uuid').v4()
  resultPrint.status  = 304
  resultPrint.message = obj.resMessage || 'Data is not modified successfully'
  resultPrint.data    = obj

  res.status(resultPrint.status).json(resultPrint)
}