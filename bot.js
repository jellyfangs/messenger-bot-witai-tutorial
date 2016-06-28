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

var processMsg = function (message, sessionId) {
  // GET THE MESSAGE
  var msg = message.text
  console.log("Haz message text? ", msg)

  // GET THE ATTACHMENT
  var att = message.attachments
  console.log("Haz attachment? ", att)

  // GET THE SESSION ID
  console.log("Haz session id? ", sessionId)

  // GET THE SESSION
  console.log("Haz session? ", sessions[sessionId])

  // LETS PROCESS THE MESSAGE
  // If Attachment then reply...
	if (att) {
		msg = 'That is cool but I am do not understand attachments yet'
	} else {
		// Forward to our NLP service to reply...
		wit.runActions(sessionId, msg, sessions[sessionId].context, function (error, context) {
			if (error) {
				console.log('oops! got an error: ', error)
			} else {
				console.log('waiting for more messages')
				console.log('context', context)

				if (context['stop']) {
					delete sessions[sessionId]
					return {
						msg: 'Done!',
						sessions: sessions
					}
				}

				// update users current session state
				sessions[sessionId].context = context
			}
		})
	}
	
	// return {
	// 	msg: msg, 
	// 	sessions: sessions,
	// }
}



module.exports = {
	processMsg: processMsg,
	findOrCreateSession: findOrCreateSession,
}