'use strict'

var request = require('request')
var Config = require('./config')

// SETUP A REQUEST TO FACEBOOK SERVER
var newRequest = request.defaults({
	uri: 'https://graph.facebook.com/v2.6/me/messages',
	method: 'POST',
	json: true,
	qs: {
		access_token: Config.FB_PAGE_TOKEN
	},
	headers: {
		'Content-Type': 'application/json'
	},
})

// SETUP A MESSAGE FOR THE FACEBOOK REQUEST
var newMessage = function (recipientId, msg, attachment, cb) {
	var opts = {
		form: {
			recipient: {
				id: recipientId,
			}
		}
	}

	if (attachment) {
		opts.message = {
			text: msg
		}
	} else {
		opts.message = {
			text: msg
		}
	}

	newRequest(opts, function (err, resp, data) {
		if (cb) {
			cb(err || data.error && data.error.message, data)
		}
	})
}

var newAttachment = function (recipientId, msg, cb) {
	var opts = {
		form: {
			recipient: {
				id: recipientId,
			},
			message: {
				text: msg
			}
		}
	}

	newRequest(opts, function (err, resp, data) {
		if (cb) {
			cb(err || data.error && data.error.message, data)
		}
	})
}

// PARSE A FACEBOOK MESSAGE to get user, message body, or attachment
// https://developers.facebook.com/docs/messenger-platform/webhook-reference
var getMessageEntry = function (body) {
	var val = body.object === 'page' &&
						body.entry &&
						Array.isArray(body.entry) &&
						body.entry.length > 0 &&
						body.entry[0] &&
						body.entry[0].messaging &&
						Array.isArray(body.entry[0].messaging) &&
						body.entry[0].messaging.length > 0 &&
						body.entry[0].messaging[0]
	return val || null
}

module.exports = {
	newRequest: newRequest,
	newMessage: newMessage,
	getMessageEntry: getMessageEntry,
}