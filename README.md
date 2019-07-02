# 🎶 Spotify Song Adder 🎵

👋 This is a project based on a previous project where I [scraped](https://github.com/hkievet/hypem-scraper) song information from [hypem.com](https://hypem.com)'s time machine's top 5 songs since 2008.

You might find this repo useful in learning how to use Spotify's API.

## How to run:

⚡️ Clone and run `npm install` or `yarn install` ⚡️

First head on over to [Spotify API](dev.spotify.com) and make an app. I made a web app. 📝 Note the client id and a client secret.

Then whitelist a url for the api callback (I used my [personal website](http://hkievet.com)). 📝 Note the url you whitelist.

Then run the `getAuthToken()` function in `index.js` (using node). Retrieve the access token query parameter from the url. 📝 Note the access token.

Make a playlist in the spotify client and copy the playlist uri (ie., spotify:user:hkievet:playlist:5UMSD58fg2orqadYWPNG8l). 📝 Note the hash part of this playlist uri.

Copy the `.env.template` file to `.env` and fill in all the information that you noted.

Now that everything is setup, you can upload songs to a playlist. By running the `batch100Songs()` function, the hypem song list will be added to the playlist matching the uri in .env. 🚀🌊
