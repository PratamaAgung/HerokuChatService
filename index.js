var admin = require('firebase-admin');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; 

var currentPath = process.cwd();
var serviceAccount = require(currentPath + '/shakeandchat-a76f3-firebase-adminsdk-j9rdb-12775496cc.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://shakeandchat-a76f3.firebaseio.com"
});

var router = express.Router();

router.get('/', function(req, res){
    res.json("{result: 'welcome'}");
});

router.post('/add-user', function(req, res){
    // console.log(req.body.name);
    // console.log(req.body.key);
    console.log(req.query);
    res.json("");
});

router.post('/send-notif', function(req, res){
	var message = {
		data: {
			title : req.query.sender,
			content : req.query.content,
		},
		topic : req.query.destination
	}

	admin.messaging().send(message)
	  .then((response) => {
	    // Response is a message ID string.
	    console.log('Successfully sent message:', response);
	    res.json("{status: 'success'}");
	  })
	  .catch((error) => {
	    console.log('Error sending message:', error);
	    res.json("{status: 'error'}");
	  });

});


app.use('/service', router);
app.listen(port);
console.log('Service start on port ' + port);