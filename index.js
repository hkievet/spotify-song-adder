const fs = require("fs");
require("dotenv").config();
var Spotify = require("node-spotify-api");
stringSimilarity = require("string-similarity");
var request = require("request");

// load environment variables
let clientSecret = process.env.CLIENT_SECRET;
let clientPublic = process.env.CLIENT_PUBLIC;
let accessToken = process.env.ACCESS_TOKEN;
let whiteListedUrl = process.env.WHITE_LISTED_URL;
let playlistId = process.env.PLAYLIST_URL;

function getAuthToken() {
  let url = `https://accounts.spotify.com/authorize?client_id=${clientPublic}&redirect_uri=${whiteListedUrl}&scope=playlist-modify-public%20user-read-email&response_type=token&state=12`;
  console.log("Visit this url and then copy the access token to .env:");
  console.log(url);
  return;
}

function loadSongs() {
  let rawdata = fs.readFileSync("songs.json");
  let songs = JSON.parse(rawdata).tracks;
  return songs;
}

function makeUniqueUris(songs) {
  if (!songs) {
    songs = loadSongs();
  }
  var uris = [];
  for (var i = 0; i < songs.length; i++) {
    var song = songs[i];
    if (song.spotify_link) {
      rawSpotifyUri = song.spotify_link;
      spotifySongUri = extractUri(rawSpotifyUri);
      uris.push(spotifySongUri);
    }
  }
  uniqUris = [...new Set(uris)];
  return uniqUris;
}

function batch100Songs(uniqUris) {
  // Batch add a list of spotify track uris by 100
  if (!uniqUris) {
    uniqUris = makeUniqueUris();
  }
  var i = 0;
  while (true) {
    var cap = i + 100;
    if (cap > uniqUris.length - 1) {
      cap = uniqUris.lenght - 1;
    }
    var batchUris = uniqUris.slice(i, cap);
    i += 100;
    addSongs(batchUris);
    if (i > uniqUris.length - 1) {
      break;
    }
  }
}

function extractUri(sloppySpotifyLink) {
  // ie /go/spotify_track/5xlJitVKUJbCue34uZD534 -> spotify:track:5xlJitVKUJbCue34uZD534 (from my dumb data set...)
  var splitty = sloppySpotifyLink.split("/");
  return "spotify:track:" + splitty[splitty.length - 1];
}

function addSongs(songUris) {
  // Add a list of song uris to a playlist
  var apiUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  var header = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + accessToken
  };
  var body = {
    uris: songUris
  };
  body = JSON.stringify(body);
  var options = {
    url: apiUrl,
    method: "POST",
    headers: header,
    body: body
  };
  request(options, function(err, resp, body) {
    console.log(resp);
  });
}

function addSong(songUri) {
  // add a single song to a playlist
  var apiUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  var header = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + accessToken
  };
  var body = {
    uris: [songUri]
  };
  body = JSON.stringify(body);
  var options = {
    url: apiUrl,
    method: "POST",
    headers: header,
    body: body
  };
  request(options, function(err, resp, body) {
    console.log(resp);
  });
}

function getSpotifyTrackUri(name, _artist) {
  // don't even really need this function because my data actually has
  // the spotify uri... oops... but this is kind of cool, might use later.

  // instantiate the Spotify client
  var spotify = new Spotify({
    id: clientPublic,
    secret: clientSecret
  });

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
  });
}

// Get the auth token
// getAuthToken()

// Setup .env from .env.template

// batch100Songs();
