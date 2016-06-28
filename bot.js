'use strict'

var Config = require('./config')
var wit = require('./wit').getWit()

// LETS SAVE USER SESSIONS
var sessions = {}

var findOrCreateSession = function (fbid) {
  var sessionId

  // DOES USER SESSION ALREADY EXIST?
  Object.keys(sessions).forEach(k => {
    if (sessions[k].fbid === fbid) {
      // YUP
      sessionId = k
    }
  })

  // No session so we will create one
  if (!sessionId) {
    sessionId = new Date().toISOString()
    sessions[sessionId] = {
      fbid: fbid,
      context: {
        _fbid_: fbid
      }
    }
  }

  return sessionId
}

var processMsg = function (sender, message, cb) {
	// GET THE SESSION ID
  console.log("Who iz sender?", sender)

  var session = findOrCreateSession(sender)

  // GET THE SESSION
  console.log("Haz session?", session)

  // GET THE MESSAGE
  console.log("Haz message text?", message)

  // GET THE CB
  console.log(cb)
  cb(sender, 'hello')

  // LETS PROCESS THE MESSAGE
  // If Attachment then reply...
	// if (atts) {
	// 	cb('That is cool but I am do not understand attachments yet')
	// } else if (msg) {
	// 	// Forward to our NLP service to reply...
	// 	wit.runActions(sessionId, msg, sessions[sessionId].context, function (error, context, cb) {
	// 		if (error) {
	// 			console.log('oops! got an error: ', error)
	// 		} else {
	// 			console.log('waiting for more messages')
	// 			console.log('context', context)

	// 			if (context['done']) {
	// 				delete sessions[sessionId]
	// 			}

	// 			// update users current session state
	// 			sessions[sessionId].context = context

	// 			// give back
	// 			cb()
	// 		}
	// 	})
	// } else {
	// 	return 'Hmm...'
	// }
}


var read = function (sender, message, reply) {
	if (message === 'hello') {
		// Let's reply back hello
		message = 'hello yourself'
		reply(sender, message)
	} else {
		// Let's find the user
		var sessionId = findOrCreateSession(sender)
		// Let's forward the message to the Wit.ai bot engine
		// This will run all actions until there are no more actions left to do
		wit.runActions(
			sessionId, // the user's current session by id
			message,  // the user's message
			sessions[sessionId].context, // the user's session state
			function (error, context) { // callback
			if (error) {
				console.log('oops!', error)
			} else {
				// Wit.ai ran all the actions
				// Now it needs more messages
				console.log('Waiting for further messages')

				// Based on the session state, you might want to reset the session
				// Example:
				// if (context['done']) {
				// 	delete sessions[sessionId]
				// }

				// Updating the user's current session state
				sessions[sessionId].context = context
			}
		})
	}
}



module.exports = {
	processMsg: processMsg,
	findOrCreateSession: findOrCreateSession,
	read: read,
}