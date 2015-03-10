// Loading the express library
var express = require('express');
var app = express();

// Body-parser
var bodyParser = require('body-parser');
// We need to catch JSON, need to change
var urlencoded = bodyParser.urlencoded({ extended: false });

// Redis connection
var redis = require('redis');
var client = redis.createClient();

 // Select different database to run on
client.select((process.env.NODE_ENV || 'development').length);

// Now store the API key and API call into the Redis

// GET on '/'
app.get('/', function(request, response){
	//if (error) throw error;
	response.send("OK");
});

// GET on '/customers'
app.get('/customers', function(request, response){
	//if (error) throw error;
	response.json("OK");
});

// POST on '/customers'
app.post('/customers', urlencoded, function(request, response){
	var newCustomer = request.body;
	if (!newCustomer.name || !newCustomer.description){
		response.sendStatus(400);
		//return false;
	}
	client.hset('customers', newCustomer.name, newCustomer.description, function(error){
		if (error) throw error;

		response.status(201).json(newCustomer.name);
	});
});

// DELETE on '/customers'
app.delete('/customers/:name', function(request, response){
	client.hdel('customers', request.params.name, function(error){
		if (error) throw error;
		response.sendStatus(204);
	});
});

// export the module so that it could be called elsewhere
module.exports = app;