var mongoose = require('mongoose');
mongodbURL = process.env.MONGODB_URI;
var mongodbOptions = { };

mongoose.connect(mongodbURL, mongodbOptions, function (err, res) {
    if (err) {
        console.log('Connection refused to ' + mongodbURL);
        console.log(err);
    } else {
        console.log('Connection successful to: ' + mongodbURL);
    }
});

// Schemas
var Song = new mongoose.Schema({
	title: { type: String, required: true }
	// year? album?
});

var Quote = new mongoose.Schema({
	text: { type: String, required: true },
	song: { type: mongoose.Schema.ObjectId, ref: 'Song' }
	// tweeted count
});

// Models
var modelSong = mongoose.model('songs', Song);
var modelQuote = mongoose.model('quotes', Quote);

// Exports
exports.modelSong = modelSong;
exports.modelQuote = modelQuote;
