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



module.exports = {
	processMsg: processMsg,
	findOrCreateSession: findOrCreateSession,
}