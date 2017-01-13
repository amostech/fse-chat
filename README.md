# FSE Chat Room

> Simple single chat room app that implements a REST API using express and also a client web app using HTML5, Material Design and Angular
 
 This project contains two modules:

	fse-chat-client
	fse-char-server

![Alt text](/arch.png?raw=true)

- Frameworks Used:
	- Express
	- Socket.io
	- MongoDB
	- Mongoose (Schema and simple API for DAO generation)
	- Angular
	- Material Design CSS getmdl.io

# fse-chat-server
Database of choice to persist user data and messages: MongoDB

The component choice to access the database was Mongoose (use of schemas)

The server component of this project consists in an Express 4 node web app that serves only the purpose of exposing a REST API that contains the following endpoints

	POST - messages
		{
			"message" : "Content of chat message",
			"sent_at": 1484119573957
		}
	POST - user
		{
			"username": "userA",
			"status": "online"
		}
	GET - messages
		@returns array of messages from mongodb	
	GET - user
		@returns array of users from mongodb
		
