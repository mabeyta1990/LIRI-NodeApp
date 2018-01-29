var Twitter = require('twitter');
var Spotify = require('spotify');
var request = require('request');
var fs = require('fs');
var keys = require('./keys.js');

var twitterKeys = keys.twitterKeys;
var liriCommand = process.argv[2];
//INSTRUCTIONS TO BE DISPLAYED FOR THE USER WHEN RUNNING--------------------------------------------------------------
switch(liriCommand) {
  case "my-tweets": myTweets(); break;
  case "spotify-this-song": spotifyThisSong(); break;
  case "movie-this": movieThis(); break;
  case "do-what-it-says": doWhatItSays(); break;
  default: console.log("\r\n" +"Try typing one of the following commands: " +"\r\n"+
    '1.    node liri.js my-tweets\n' + 
    '2.    node liri.js spotify-this-song "<song_name>"\n' + 
    '3.    node liri.js movie-this "<movie_name>"\n' + 
    '4.    node liri.js do-what-it-says\n');
};
//MYTWEETS FUNCTION----------------------------------------------------------------------------------------------
/*
I am getting an 'Invalid or expired token' error and I have regenerated my keys multiple times.
*/
function myTweets() {
  fs.appendFile('./log.txt', 'User Command: node liri.js my-tweets\n\n');
	var client = new Twitter(twitterKeys);
	var params = {screen_name: 'mikeabeyta4411', count: 20};
  
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (error) {
      console.log("Error:");console.log(error);
    } 
    else {
      //PRINT TWEETS TO SCREEN
			var printedTweet = 'User Tweets:\n' + 
							'------------------------\n\n';
			for (var tweetIndex = 0; tweetIndex < tweets.length; tweetIndex++) {
				printedTweet += 'Created: ' + tweets[tweetIndex].created_at + '\n' + 
							 'Tweet: ' + tweets[tweetIndex].text + '\n';
			}
      //APPEND TWEETS TO LOG.TXT
      fs.appendFile('./log.txt', 'Tweets:\n\n' + printedTweet + '\n');
				console.log(printedTweet);
		}
	});
}
//spotifyThisSong FUNCTION-------------------------------------------------------------------------------------------------
function spotifyThisSong(song) {
  var spotify = new Spotify({
    id: '9d66640d49764d51bf4153ea03dbe6ed',
    secret: '96d6674fee1449978af82e6daa3ff3ee'
  });

	fs.appendFile('./log.txt', 'User Command: node liri.js spotify-this-song ' + search);
  var search;
  if (song === '') {
		search = 'The Sign Ace Of Base';
  } 
  else {
		search = song;
	}

	spotify.search({ type: 'track', query: search}, function(error, data) {
	    if (error) {
      fs.appendFile('./log.txt', error);
      console.log(error);
      } 
      else {
			  var songInfo = data.tracks.items[0];
			  if (!songInfo) {
				  console.log(error);
        } 
        else {
			  var songDetails = '------------------------\n' + 
					'Song Information:\n' + 
					'Song Name: ' + songInfo.name + '\n'+ 
					'Artist: ' + songInfo.artists[0].name + '\n' + 
					'Album: ' + songInfo.album.name + '\n' + 
					'Preview Here: ' + songInfo.preview_url + '\n';
				//APPEND SONG DETAILS TO LOG.TXT
				fs.appendFile('./log.txt', 'DETAILS:\n\n' + songDetails);
					console.log(songDetails);
			  }
	    }
	});
}
//MOVIE-THIS FUNCTION-----------------------------------------------------------------------------------------------------
function movieThis(movie) {
	fs.appendFile('./log.txt', 'User Command: node liri.js movie-this ' + movie);
	var search;
	  if (movie === '') {
		search = 'Mr. Nobody';
    } 
    else {
		search = movie;
	  }

  var queryStr = 'http://www.omdbapi.com/?apikey=trilogy&t' + search + '&plot=full&tomatoes=true';
	request(queryStr, function (error, response, body) {
		if ( error || (response.statusCode !== 200) ) {
				console.log(error);
    }
    else {
			var data = JSON.parse(body);
			if (!data.Title && !data.Released && !data.imdbRating) {
      } 
      else {
		    	//PRINT MOVIE DETAILS TO SCREEN
		    	var movieDetails = 'Movie Information:\n' + 
								'------------------------\n\n' +
								'Movie Title: ' + data.Title + '\n' + 
								'Year Released: ' + data.Released + '\n' +
								'IMBD Rating: ' + data.imdbRating + '\n' +
								'Country Produced: ' + data.Country + '\n' +
								'Language: ' + data.Language + '\n' +
								'Plot: ' + data.Plot + '\n' +
								'Actors: ' + data.Actors + '\n' + 
								'Rotten Tomatoes Rating: ' + data.tomatoRating + '\n' +
								'Rotten Tomatoes URL: ' + data.tomatoURL + '\n';
				  //APPEND MOVIE DETAIL TO LOG.TXT
				  fs.appendFile('./log.txt', 'DETAILS:\n\n' + movieDetails + '\n', (err) => {
					  if (err) throw err;
					  console.log(movieDetails);
				  });
			    }
		}
	});
}
//DO-WHAT-IT-SAYS FUNCTION -----------------------------------------------------------------------------------------------------
function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function(error, data){
    if (!error) {
      doWhatItSaysResults = data.split(",");
      spotifyThisSong(doWhatItSaysResults[0], doWhatItSaysResults[1]);
    }
    else {
      console.log("Error:" + error);
    }
  });
};