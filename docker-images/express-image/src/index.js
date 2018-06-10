var Chance = require('chance');
var chance = new Chance;

var fontAwesomeList = require('font-awesome-list');

var express = require('express');
var app = express();

// Get all the fontAwesome Icons
const allIcons = fontAwesomeList.all();


app.get('/', function(req, res){
	res.send(getRandomFontIcons());
});

app.listen(3000, function(req, res){
	console.log('Accepting HTTP requests on port 3000.');
});

function getRandomFontIcons() {
	var numberOfIcons = chance.integer({
		min: 3,
		max: 8
	});
	console.log(numberOfIcons);
	var fontAwesomeIcons = [];
	for(var i = 0; i < numberOfIcons; ++i){
        // Getting a random icon
        var icon = allIcons[chance.integer({
            min: 0,
            max: allIcons.length - 1 
        })];

        // Get icon informations
		fontAwesomeIcons.push({
			id: icon.id,
			name: icon.name,
			categories: icon.categories,
			unicode: icon.unicode
		});
	};
	console.log(fontAwesomeIcons);
	return fontAwesomeIcons;
}