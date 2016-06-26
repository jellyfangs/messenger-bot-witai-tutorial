'use strict'

var Config = require('./config')
var wit = require('./wit').getWit()

var processMsg = function (message) {
  // GET THE CONTENT
  var msg = message.text
  console.log("Haz message text? ", msg)

  // GET THE ATTACHMENT
  var att = message.attachments
  console.log("Haz attachment? ", att)

  // LETS PROCESS THE MESSAGE
	if (att) {
		msg = 'That is cool but I am do not understand attachments yet'
	} else if (msg.indexOf('hello') > -1) {
		msg = 'Hello yourself'
	} else {
		msg = msg
	}
	
	return msg
}

module.exports = {
	processMsg: processMsg,
}