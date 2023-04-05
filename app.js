require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artist-search", (req, res) => {
  console.log(`This artist: ${req.query.artist}`);
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      //console.log("The received data from the API: ", data.body);
      //Add styles to the object and pass my css
      data.body.artists.styles = "artist.css"
      const artists = data.body.artists;
      //console.log(`This data: ${artists}`)
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

      res.render("artist-search-results", data.body.artists);
      // res.render("artist-search-results", { artists: data.body.artists.items });
      //console.log(data.body.artists.items[0])
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  const artistId = req.params.artistId;
  //console.log(artistId)
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      //console.log('Data',data)
      //console.log("Artist albums", data.body);
      data.body.styles = "albums.css"
      // res.render("albums", { albums: data.body.items });
      res.render("albums", data.body);
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
});

app.get("/tracks/:albumId", (req, res) => {
  const tracksId = req.params.albumId;
  console.log(tracksId);
  spotifyApi
    .getAlbumTracks(tracksId)
    .then((data) => {
      //console.log("Albums tracks", data.body);
      //console.log("This track", data.body.items[0].preview_url);
      data.body.styles= "tracks.css";
      // res.render("tracks", { tracks: data.body.items });
      res.render("tracks", data.body)
    })
    .catch((err) =>
      console.log("The error while searching tracks occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
