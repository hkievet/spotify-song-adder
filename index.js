const fs = require("fs");
require("dotenv").config();
var Spotify = require("node-spotify-api");
stringSimilarity = require("string-similarity");

let clientSecret = process.env.CLIENT_SECRET;
let clientPublic = process.env.CLIENT_PUBLIC;
let accessToken = process.env.ACCESS_TOKEN;

var spotify = new Spotify({
  id: clientPublic,
  secret: clientSecret
});

/*
spotify.search({ type: "track", query: "All the Small Things" }, function(
  err,
  data
) {
  if (err) {
    return console.log("Error occurred: " + err);
  }

  console.log(data);
});
*/

if (!accessToken) {
  //https://developer.spotify.com/documentation/general/guides/authorization-guide/#implicit-grant-flow
  let url = `https://accounts.spotify.com/authorize?client_id=${clientPublic}&redirect_uri=http:%2F%hkievet.com&scope=playlist-modify-public%20user-read-email&response_type=token&state=12`;
  console.log("Visit this url and then copy the access token to .env");
  console.log(url);
  return;
}

let playlistId = "5UMSD58fg2orqadYWPNG8l";

function loadSongs() {
  let rawdata = fs.readFileSync("songs.json");
  let songs = JSON.parse(rawdata);
  return songs;
}

function printSongs(songs) {
  for (song in songs.tracks) {
    console.log(songs.tracks[song]);
  }
}

function addSong(songUri) {
  // stub
  return;
}

function findTrack(name, _artist) {
  spotify.search({ type: "track", query: name }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    if (data && data.tracks && data.tracks.items) {
      for (var i = 0; i < data.tracks.items.length; i++) {
        item = data.tracks.items[i];
        for (var j = 0; j < item.artists.length; j++) {
          artist = item.artists[j];
          if (artist && artist.name) {
            console.log(artist.name);
            var similarity = stringSimilarity.compareTwoStrings(
              artist.name,
              _artist
            );
            if (similarity > 0.8) {
              console.log(item);
              return;
            }
          }
        }
      }
    }
    //console.log(data.tracks.items);
    //console.log(data.tracks.items.length);

    //console.log(data.tracks.items);
  });
}

// findTrack("Don't Talk About It", "Sorcha Richardson");
// var similarity = stringSimilarity.compareTwoStrings("h3ll", "hello");
// console.log(similarity);
