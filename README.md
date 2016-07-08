# 🤖 Add Wit.ai to Your Facebook Messenger bot

![Alt text](/demo/Demo.gif)

Facebook Messenger is a platform that reaches over a billion people world wide. Now that Facebook has opened up access to sending and receiving messages many new opportunities open up.

You can jack up your chat bot’s smarts with two tech buzzwords: natural language processing (NLP) and natural language understanding (NLU). Those two things can make your chat bot not awkwardly ask you again and again what someone just said.

You can read the [5 min quickstart](https://wit.ai/docs/quickstart) the Wit.ai team prepared but it's really only meant for beginners and not for intermediate hackers.

So instead here is how to add Wit.ai to do real things in 30 minutes.

## 🤔 Firstly, what’s the difference between NLP and NLU?

NLP helps you break down a sentence into things called entities. It’s like primary school for your bot. For example, NLP can read the sentence “Sally sold seashells by the seashore” and figure out there’s an entity Sally, that there’s another entity sold, that there are entities seashells and seashore.

Sometimes just having words in a sentence is enough. You can extract category or keywords and from there you can hack your chat bot to do something. But for more smarts you need to take your bot to the equivalent of university.
NLU helps you figure out what that sentence meant. Sally did something with something. And because of that the chat bot can then react and respond based on what Sally did do and with what. In other words, with NLU your chat bot can figure out human concepts like intent or sentiment.

## 🏃 Get ready!

If you have not built a chat bot before then read my other tutorial first: [http://github.com/jw84/messenger-bot-tutorial](http://github.com/jw84/messenger-bot-tutorial)

Be sure you know how to deploy a Heroku server. You can then git clone this repository, running npm install, and get started.

### *Setup Wit.ai*

1. Sign up for a Wit.ai account here: https://wit.ai

2. Go clone my weather app: [https://wit.ai/jw84/weather](https://wit.ai/jw84/weather)

3. Find the app token in your weather app so we can test everything is working. In your app go to the Settings page then find the “Server Access Token” in API Details.

![Alt text](/demo/Demo1.jpg)

Let’s test first that the token works by running this command in your Terminal:

	curl -H 'Authorization: Bearer <YOUR TOKEN HERE>' 'https://api.wit.ai/message?v=20160526&q=what%20is%20the%20weather%20in%20New%20York'

You should get back a response like:

	{
	  "msg_id" : "14735f29-daa9-4553-a259-24cfa8c4ba42",
	  "_text" : "what is the weather in New York",
		"entities": {
			"location": [ {
				"confidence": 0.9984463453705885,
				"type": "value",
				"value": "New York",
				"suggested": true
			} ]
		}
	}

Great success! ✨

### *Deploy the chat bot to the clouds*

1. Git clone my bot here

2. I have organized my chat bot into four major components: the server, the Facebook Messenger connector, the bot app, and the NLP service. It’s a good idea to make chat bots modular. You can progressively add more more components to make the bot understand language or locations but you should also be able to remove components and until only a web server is left.

3. Deploy the bot to Heroku by running these command in Terminal inside the cloned git repo directory. A page should pop up meaning your app is ready. Be sure to remember the URL of your Heroku app.

	```
	heroku apps:create
	git push heroku master
	heroku open
	```

Setup Facebook to talk to your chat bot

1. Go to [https://developers.facebook.com](https://developers.facebook.com) and create a new app, be sure to add Facebook Messenger as a product to the app. You can also use an existing an app.

2. Go to the settings page of the app you’ve made then go to the Messenger settings page. Here you will generate a token of the Facebook Page to link to with Messenger. Remember to save this token key somewhere.

![Alt text](/demo/Demo2.jpg)

3. Set up Webhooks to your FB app. Remember to use the link to your own Heroku app.

![Alt text](/demo/Demo3.jpg)
![Alt text](/demo/Demo4.jpg)

Click Verify and Save. You should see the Complete sign!

4. Now we’ll set up the server again. Set the keys required as environment variables to make the bot work by running these commands in Terminal:

	```
	heroku config:set WIT_TOKEN='your_token_here'
	heroku config:set FB_PAGE_TOKEN='your_token_here'
	```

When that’s done you should be able to at least say hi to your chat bot and have it echo back hi! 🤖


### *Create stories in Wit.ai*

Wit.ai does the hard work for you by creating a simple to use interface to manage what are called “stories” — these are ways to extract meaning from a keyword or sentence.

![Alt text](/demo/Demo5.jpg)

For now you might have to write a lot of stories for your chat bot to understand language but soon Wit.ai has a vision that we can share hundreds of stories with each other. And with more stories the more skills your chat bot will have.


## 🎓 Time to teach your bot!

### *Extract location out of conversations*

1. Create a new story in the Wit dashboard. The first type of story we’ll write is extracting location from conversations. This way we can build a weather bot! Go here [https://wit.ai/jw84/weather/stories](https://wit.ai/jw84/weather/stories) to see the recipe I’ve created.

![Alt text](/demo/Demo6.jpg)

2. Find the Read function in the bot.js file. Here the bot can recognize messages. The first message can be hello, the chat bot can send back an introduction. Otherwise, we can pass the message on to Wit.ai for processing.

![Alt text](/demo/Demo7.jpg)

3. Let’s test and see if the weather shows up!

![Alt text](/demo/Demo8.gif)

### *Extract category and sentiment out of conversations*

1. Create yet another Wit app in the dashboard. This new app will have three stories to extract the category and sentiment entities out of a conversation so your chat bot can reply with some cute pics! Go here [https://wit.ai/jw84/cutepics/stories](https://wit.ai/jw84/cutepics/stories) to see the recipe

2. Create a new story to look for the user response then trigger the bot to execute the action and respond.

![Alt text](/demo/Demo9.jpg)

When you double click a word it will be highlighted as blue, after assigning the word as an entity the highlight turns purple to indicate Wit.ai has learned.

Have the bot execute a merge function to extract the entity and save it to the context object. Then execute the fetch-pics action to return the actual pic itself. Thereafter you can trigger two replies by Wit.ai, one saying what the category is and the other the image link itself.

3. Add and create two more stories based on my template. Each will help train Wit.ai on what to look for and how to respond to a sentiment and to an acknowledgement.

![Alt text](/demo/Demo10.jpg)

4. Now we can test. Be sure to update your Heroku server with the new Wit app’s token by running this command:

	```
	heroku config:set WIT_TOKEN='your_new_token_here'
	```

Let’s go back and chat it up. Ask to see some corgis. Then ask to see some racoons!

![Alt text](/demo/Demo11.gif)

Congratulations you’ve made a chat bot that’s smart enough to know what you’re talking about, what you mean, and reply back accordingly!

## 🤓 Tell Your Chat Bot What’s What

NLP and NLU are not magical! They are merely defining rules for your bot. Your chat bot will break sometimes and maybe even often when being told new and interesting conversations it’s never heard before.

It is now up to you to help keep training and testing your bot until it’s the very best. You have two tools in Wit.ai to do so. Go to the console and let’s learn about the Inbox and the Understanding page.

### *Training your chat bot*

Wit.ai has an inbox that shows you all the messages it has received. From here you can pick and choose which one to validate and contribute to the training data of your chat bot.

![Alt text](/demo/Demo12.jpg)

For example, if you have an entity of location you can assign more values to help train your chat bot to know that “San Francisco” and “Timbuktu” are both locations. If you have categories for “corgis” then you can also validate that “dogs” can mean the same thing.

The more people that talk to your chat bot and the more complex your bot is the more you will spend time in this page. And the work you do here will help make your bot even smarter.

### *Testing your chat bot*

The other page you will be spending time at will be in the Understanding page. Here you can try out sentences yourself to test whether your chat bot can understand and to troubleshoot when a sentence doesn’t trigger the right response.

![Alt text](/demo/Demo13.jpg)

## 📡 How to share your bot

Learn how to get your bot approved for public use [here](https://developers.facebook.com/docs/messenger-platform/app-review).

Remember, your chat bot has to be approved by Facebook so that anyone can talk to it. Otherwise, you have to go to the Roles page in your Facebook app and add testers.

![Alt text](/demo/Demo14.jpg)

### *Add a chat button to your webpage*

Go [here](https://developers.facebook.com/docs/messenger-platform/plugin-reference) to learn how to add a chat button your page.

### *Create a shortlink*

You can use https://m.me/<PAGE_USERNAME> to have someone start a chat.

## 💡 What's next?

Read about all things chat bots with the ChatBots Magazine [here](https://medium.com/chat-bots)

You can also design Messenger bots in Sketch with the [Bots UI Kit](https://bots.mockuuups.com)!

## How I can help

I build and design bots all day. Email me for help!

## Credit

Thanks to [https://github.com/hunkim/Wit-Facebook](https://github.com/hunkim/Wit-Facebook) for the inspiration
