require("dotenv").config();

var keys = require("./keys.js");
 
var Twitter = require('twitter');

var spotify = require('node-spotify-api');

var S = new spotify(keys.spotify)

var request = require('request');

var fs = require('fs');

var omdb = require('omdb-client')


 
var grabTweets = function() {

      var client = new Twitter(keys.twitterKeys);
        
      var params = {screen_name: 'tillery_iii'};
      client.get('statuses/user_timeline', params, function(error, tweets, response) {
        
      if (!error) {  
        for(var i = 0;i<tweets.length;i++){
        console.log(tweets[i].created_at);
        console.log(" ");
        console.log(tweets[i].text);
          }
        }

      });

}

var getArtistNames = function(artist){
  return artist.name;
}

var getMeSpotify = function(songName){

S.search({ type: 'track', query: songName}, function(err, data) {
    if ( err ) {
        console.log('Error occurred: ' + err);
        return;
    }

    var songs = data.tracks.items;
    for(var i=0;i<songs.length; i++){
      console.log(i);
      console.log("artist(s): " + songs[i].artists.map(
        getArtistNames));
      
    
    console.log('song name: ' + songs[i].name);
    console.log('preview song: ' + songs[i].preview_url);
    console.log('album ' + songs[i].album.name);
    console.log("-------------------------------------------");
      } 
  });
}
 function getMovie(){

 var movieName= "";
 var inputs = process.argv;

for(var i = 3; i<inputs.length; i++){
  movieName += inputs[i] + " ";
};

movieName = movieName.trim();

fs.appendFile("log.txt", ["\n", process.argv[2], movieName], function(err){
  if (err) throw err;
})



var params = {
  "apiKey":  "43fa6835",
  "title":    movieName

};


omdb.get(params, function(err, movie){

  if (err){
    return console.error(err);
  }

  else{
  var splitStr = movieName.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
  }
  movieName = splitStr.join(' ');
  console.log("\n" + movie.Title) + (" (" + movie.Year + ")");
  console.log("\nIMDB Rating: " + movie.imdbRating);
  console.log("Rotten Tomatoes: " + movie.Ratings[1].Value);
  console.log("Country: " + movie.Country);
  console.log("Language: " + movie.Language);
  console.log("\n" + movie.Plot);
  console.log("\nActors: " + movie.Actors);
  console.log("\n************************************************************************************************************************");
    }
  });
 }




 var doWhatItSays = function(){
 fs.readFile('random.txt', 'utf8', function (err, data) {
  if (err) throw err;
 
  var dataArr = data.split(",");

if(dataArr.length ==2){
  pick(dataArr[0], dataArr[1]);
}else if (dataArr.length == 1){
  pick(dataArr[1])
}

  });
 }






var pick = function(caseData, functionData) {
  switch(caseData){
    case 'my-tweets' :
    grabTweets();
    break;
    case 'spotify-this-song' :
    getMeSpotify(functionData)
    break;
    case 'what-movie' :
    getMovie();
    break;
    case "do-what-it-says" :
    doWhatItSays();
    break;
  default:
  console.log("Liri doesn't know how to do that!")
  }
}

var runThis = function(argOne,argTwo){

  pick(argOne, argTwo);

};

runThis(process.argv[2], process.argv[3]);


