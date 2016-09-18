var express        = require('express');
var config         = require('../config.js');
var functions      = require('./functions');
var path           = require('path')
var _              = require('lodash');
var uuid           = require('node-uuid');
var nodemailer     = require('nodemailer');
var validator      = require('validator');
var emailTemplates = require('email-templates');
var templatesDir   = path.resolve(config.root + '/views/mail')

var transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.supportEmail.email,
    pass: config.supportEmail.password
  }
})

function sendOne(emailTemplate, subject, obj) {
  emailTemplates(templatesDir, function(err, template) {
    if(err) {
      console.log(err)
    } else {
      template(emailTemplate, obj, function(err, html, text) {
        if(err) {
          console.log(err)
        } else {
          var emailFrom = 'Bridestock <mail.bridestock@gmail.com>';

          var mailOptions = {
            from: emailFrom,
            to: obj.email,
            subject: subject,
            text: text,
            html: html
          }

          transport.sendMail(mailOptions, function(err, responseStatus) {
            if(err) {
              console.log(err)
            } else {
              console.log('Message sent: ' + responseStatus.response);
            }
          })
        }
      });
    }
  })
}

exports.sendOne = function (temp, subject, obj) {
  if(express().get('env') === 'production' || config.emailTest == true) {
    sendOne(temp, subject, obj)
  }
}