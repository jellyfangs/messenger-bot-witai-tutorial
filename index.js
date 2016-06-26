'use strict'

var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')

// LETS MAKE A SERVER!
var app = express()
app.set('port', (process.env.PORT) || 5000)

// index page
app.get('/', function (req, res) {
  res.send('hello world i am a chat bot')
})

// for facebook to verify
app.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === '') {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong token')
})

// to send messages to facebook
app.post('/webhook', function (req, res) {

})

// SPIN UP SERVEr
app.listen(app.get('port'), function () {
  console.log('Running on port', app.get('port'))
})