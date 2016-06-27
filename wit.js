'use strict'

var Config = require('./config')
var FB = require('./facebook')
var Wit = require('node-wit').Wit
var request = require('request')

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
		console.log('WIT SAYS', message)

		// Bot testing mode, run cb() and return
		if (require.main === module) {
			cb()
			return
		}

		// Our bot has something to say!
		var recipientId = context._fbid_
		console.log('WIT WANTS TO TALK TO', recipientId)
		if (recipientId) {
			FB.newMessage(recipientId, message, function (err, data) {
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
	},

	// list of functions Wit.ai can execute
	['fetch-weather'](sessionId, context, cb) {
		console.log('WIT IS RUNNING FETCH WEATHER')
		console.log('Session ID', sessionId)
		console.log('Context', context)

		// Here we can place an API call to a weather service
		// if (context.loc) {
		// 	getWeather(context.loc)
		// 		.then(function (forecast) {
		// 			context.forecast = forecast || 'sunny'
		// 		})
		// 		.catch(function (err) {
		// 			console.log(err)
		// 		})
		// }

		context.forecast = 'sunny'

		cb(context)
	}
}

// SETUP THE WIT.AI SERVICE
var getWit = function () {
	console.log('GRABBING WIT')
	return new Wit(Config.WIT_TOKEN, actions)
}

module.exports = {
	getWit: getWit,
}

// bot testing mode
if (require.main === module) {
	console.log('Bot testing mode!')
	var client = getWit()
	client.interactive()
}

// GET WEATHER FROM API
var getWeather = function (location) {
	return new Promise(function (resolve, reject) {
		var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22'+ location +'%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys'
		request(url, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		    	var jsonData = JSON.parse(body)
		    	var forecast = jsonData.query.results.channel.item.forecast[0].text
		      console.log('WEATHER API SAYS....', jsonData.query.results.channel.item.forecast[0].text)
		      return forecast
		    }
			})
	})
}