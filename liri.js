//Setting global variables to store keys/argument values/parameters 
var keys = require("./keys.js");
var twitter = require("twitter");
var request = require("request");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotifyKeys);
var fs = require("fs");
var twitterClient = new twitter(keys.twitterKeys);
var action = process.argv[2];
var product = process.argv[3];

//Creating cases and breaks for the computer to cycle through and match the command line input
switch (action) {
    case "my-tweets":
        tweet();
        break;

    case "spotify-this-song":
        song(product);
        break;

    case "movie-this":
        movie(product);
        break;

    case "do-what-it-says":
        doSomething();
        break;
}

//Twitter Function
var params = {
    screen_name: "LexLuther8579",
    count: 20
}

function tweet() {
    twitterClient.get("statuses/user_timeline", function(error, tweets, response) {
        if (!error && response.statusCode == 200) {
            fs.writeFile('log.txt', "");
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].text);
                console.log(tweets[i].created_at);
                fs.appendFile('log.txt', ("Tweet: " + tweets[i].text + "Date & Time: " + tweets[i].created_at + "\r\n"));
            }
        } else {
            console.log(error);
        }
    })
}

//Spotify Function
function song(product) {
    if (product === undefined) {
        var product = "Ace of Base";
    }
    spotify.search({ type: "track", query: product }, function(err, data) {
        if (err) {
            console.log("Oops, something didn't go quite right. Please try again!");
            return;
        }
        fs.writeFile('log.txt', "");
        var firstObject = data.tracks.items[0];
        console.log(firstObject.artists[0].name);
        console.log(firstObject.name);
        console.log(firstObject.external_urls.spotify);
        console.log(firstObject.album.name);
        fs.appendFile('log.txt', ("Song Title: " + firstObject.name + "\r\n" + "Artist Name: " + firstObject.artists[0].name + "\r\n" + "Sample: " + firstObject.external_urls.spotify + "\r\n" + "Album Name: " + firstObject.album.name + "\r\n"));

    })
}

//OMDB Function
function movie(product) {
    if (product === undefined) {
        var product = "Mr. Nobody";
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + product + "&y=&plot=short&apikey=40e9cece";
    request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var info = JSON.parse(body);
            console.log("Title: " + info.Title);
            console.log("Release Year: " + info.Year);
            console.log("IMDB Rating: " + info.imdbRating);
            console.log("Rotten Tomatoes Rating: " + info.Ratings[1].Value);
            console.log("Country: " + info.Country);
            console.log("Language: " + info.Language);
            console.log("Plot: " + info.Plot);
            console.log("Actors: " + info.Actors);
            fs.appendFile('log.txt', ("Title: " + info.Title + "\r\n" + "Release Year: " + info.Year + "\r\n" + "IMDB Rating: " + info.imdbRating + "\r\n" + "Rotten Tomatoes Rating: " + info.Ratings[1].Value + "\r\n" + "Country: " + info.Country + "\r\n" + "Language: " + info.Language + "\r\n" + "Plot: " + info.Plot + "\r\n" + "Actors: " + info.Actors + "\r\n"));
        }
    });
}

//Random Function
// Takes the text inside of random.txt and uses it to call the first command with the second part as it's parameter
function doSomething() {
    fs.readFile('random.txt', 'utf8', function(error, data) {
        if (error) {
            console.log("An error has occured: " + error);
        } else {
            // console.log(data);
            var textData = data.trim().split(',');
            action = textData[0];
            product = textData[1];
            switch(action) {
          case "my-tweets":
            tweet();
            break;
          case "spotify-this-song":
            song(product);
            break;
          case "movie-this":
            movie(product);
            break;
        }
    }
});
}