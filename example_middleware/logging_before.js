'use strict';

var os = require('os');
var express = require('express');
var router = express.Router();
var auth;
var username;
var password;

router.use(function(request, response, next){
	var date = new Date();

	if (request.headers.authorization) {
        auth = new Buffer(request.headers.authorization.substring(6), 'base64').toString().split(':');
    }
	if (auth ) {
		username = auth[0];
		password = auth[1];
	}
	
	//Reformatting the header
	delete request.headers.authorization;
	request.headers.date = date;
	request.headers.username = username;
	request.headers.method = request.method;
	request.headers.url = request.url;
	
	SQSmsg(request);
	next();

});

module.exports = router;

function SQSmsg(request)
{
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./configLogging.json');

var sns = new AWS.SNS();

var publishParams = { 
  TopicArn : "arn:aws:sns:us-east-1:065434505659:VATopic",
  Message: " " + JSON.stringify(request.headers)
};

sns.publish(publishParams, publishCallback);

function publishCallback(err, data) {
  console.log("published message");
  console.log(data);
}
}

function SNSmsg(request)
{
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./configLogging.json');

var sns = new AWS.SNS();

var publishParams = { 
  TopicArn : "arn:aws:sns:us-east-1:065434505659:EmailTopic",
  Message: " " + JSON.stringify(request.headers)
};

sns.publish(publishParams, publishCallback);

function publishCallback(err, data) {
  console.log("published message");
  console.log(data);
}
}