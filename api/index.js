var express = require("express");
var app = express();
var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
 	extended: true
})); 

app.get('/', function(req, res){ 
	tweet(res);
});
app.post('/add_song', function(req, res) {
	add_song(req, res);
});
app.listen(process.env.PORT || 5000);

// Listbot config
//
// Config.keys uses environment variables so sensitive info is not in the repo.
var config = {
    me: '@mistavistaMB',

    keys: {
        consumer_key: "5woRxFSq0fKwQgtJvlKbJ42Mn",
        consumer_secret: "TUT6avRascoWAzGnrZ0nIRORFCUDbc9mH2t6rLmJYlWcqbXV9r",
        access_token_key: "4172412377-lBVrIjM86t8NkUiVvqKfAStHxnec4q1c9zYo82v",
        access_token_secret: "IqQgHgWVnlhzcllTnH1wFRvwRGVyHxRCvRDy7jR73Y11v"
    },
};

// What to do after we tweet something.
function onTweet(err) {
    if(err) {
        console.error("tweeting failed :(");
        console.error(err);
    }
}

// Tweet random quote.
function tweet(res) {
	db.modelQuote.count({} , function(err, result){
		if(err) {
			consoloe.error(err);
		}
		var count = result;
		var random = Math.floor(Math.random() * count);
		var query = db.modelQuote.findOne().skip(random).exec(
			function (err, result) {
				console.log('Tweeted: ' + result.text);
				tu.update({status: result.text}, onTweet);
				res.send(result.text);
		});
	});	
	
};

// Add song to database.
// Lyrics become split by linebreak and every non-empty line will be added as "quote".
function add_song(req, res) {
	var song = new db.modelSong();
	song.title = req.body.title;
	song.save(function(err, song) {
		if (err) { console.log(err); }
	
		quotes = req.body.lyrics.split("\n");
		
		for (var i = 0; i < quotes.length; i++) {
			text = quotes[i].trim();
			if ( text.length > 0 && text.length  < 137 ) {
				var quote = new db.modelQuote();
				quote.text = text;
				quote.song = song.id;
				
				quote.save(function(err) {
					if (err) { console.log(err); }
				});
			}
			if (text.length >= 137) {
				console.log('Quote too long: ' + text);
			}
		}
	
		return res.sendStatus(200);
	});
}

// Use the tuiter node module to get access to twitter.
var tu = require('tuiter')(config.keys);

// MongoDB
var db = require('./mongo_db.js');