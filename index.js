'use strict'

var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')

var Config = require('./config')
var FB = require('./facebook')
var Bot = require('./bot')


// LETS MAKE A SERVER!
var app = express()
app.set('port', (process.env.PORT) || 5000)
// SPIN UP SERVER
app.listen(app.get('port'), function () {
  console.log('Running on port', app.get('port'))
})
// PARSE THE BODY
app.use(bodyParser.json())


// index page
app.get('/', function (req, res) {
  res.send('hello world i am a chat bot')
})

// for facebook to verify
app.get('/webhooks', function (req, res) {
  if (req.query['hub.verify_token'] === Config.FB_VERIFY_TOKEN) {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong token')
})

// to send messages to facebook
app.post('/webhooks', function (req, res) {
  var entry = FB.getMessageEntry(req.body)

  // IS THE ENTRY A VALID MESSAGE?
  if (entry && entry.message) {
    console.log(entry.message)
    if (entry.message.attachments) {
      console.log('no attachments')
      // NO SMART ENOUGH FOR ATTACHMENTS YET
      // Maybe a Bot.processAtts() function in the future
      FB.newMessage(entry.sender.id, 'That is cool but I am do not understand attachments yet')
    } else {
      // SEND MESSAGE TO BOT FOR PROCESSING
      Bot.processMsg(entry.sender.id, entry.message.text, function (sender, msg) {
        FB.newMessage(sender, msg)
      })
    }
  }

  res.sendStatus(200)
})