'use strict'

var Config = require('./config')
var FB = require('./facebook')
var Wit = require('node-wit').Wit

// Weather Example
// See https://wit.ai/jw84/weather/stories and https://wit.ai/docs/quickstart

var firstEntityValue = function (entities, entity) {
	var val = entities && entities[entity] &&
		Array.isArray(entities[entity]) &&
		entities[entity].length > 0 &&
		entities[entity][0].value

	if (!val) {
		return null
	}
	return typeof val === 'object' ? val.value : val
}

var actions = {
	say (sessionId, context, message, cb) {
		console.log(message)

		// Bot testing mode, run cb() and return
		if (require.main === module) {
			cb()
			return
		}

		// Our bot has something to say!
		var recipientId = context._fbid_
		if (recipientId) {
			FB.sendMessage(recipientId, message, function (err, data) {
				if (err) {
					console.log(
						'Oops! An error occured while forwarding the response to',
						recipientId,
						':',
						err
					)
				}
				// Give back control
				cb()
			})
		} else {
			console.log('Oops! Did not find the user in context: ', context)
			// Give back control
			cb()
		}
	},

	merge(sessionId, context, entities, message, cb) {
		// Retrive the location entity and store it in the context field
		var loc = firstEntityValue(entities, 'location')
		if (loc) {
			context.loc = loc
		}

		cb(context)
	},

	error(sessionId, context, error) {
		console.log(error.message)
	}

	// list of functions Wit.ai can execute
	['fetch-weather'](sessionId, context, cb) {
		// Here we can place an API call to a weather service
		context.forecast = 'sunny'
		cb(context)
	}
}

// SETUP THE WIT.AI SERVICE
var getWit = function () {
	return new Wit(Config.WIT_TOKEN, actions
}

exports.getWit = getWit

// bot testing mode
if (require.main === module) {
	console.log('Bot testing mode!')
	var client = getWit()
	client.interactive()
}