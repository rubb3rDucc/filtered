// Load vars from .env file
require("dotenv").config();

const publicDir = process.argv[2] || __dirname + '/public';
const helperLibrary = require('./helperFile');
const appleMusicURL = require('./appleMusicURLS');
const allowedOrigins = ["http://localhost:3000"];
const JSONData = require("../tmp/tempLibraryDB.json");
const { client } = require("../database/DataBaseConnection");

const express = require('express');
const bodyParser = require("body-parser");

// file writing
const fs = require('node:fs');

// for the Apple Music keygen:
const jwt = require("jsonwebtoken");

const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT;
const app = express();
const cors = require('cors');

// Download the private key from Apple and save it as apple_private_key.p8:
const private_key = fs.readFileSync("./configs/apple_private_key.p8").toString();
const team_id = process.env.APPLE_TEAM_ID;
const key_id = process.env.APPLE_KEY_ID;

// JWT signing for Apple Music API, leave this all the same:
const token = jwt.sign({}, private_key, {
  algorithm: "ES256",
  expiresIn: "10m",
  issuer: team_id,
  header: {
    alg: "ES256",
    kid: key_id,
  },
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(publicDir));
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  };

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  next();
});

/**
 * kinda dead, does not return anything
 */
app.get("/", function (req, res) {
});

/**
 * 
 */
app.post("/receiveUserApiToken", function (req, res) {
  const { userToken } = req.body;

  // check if API key is response
  if (userToken === undefined) {
    console.error("Missing userAPIToken");
    return;
  }

  // write user API key to file
  fs.writeFile('./tmp/userAPIToken.txt', userToken, err => {
    if (err) {
      console.error(err);
    }
    else {
      console.log("User API Key written to file successfully");
    }
  });

});

/**
 * Generate Developer API Token
 */
app.get("/generateDeveloperToken", function (req, res) {
  // get developer API token
  try {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({ token: token }));
  } catch (error) {
    console.error(error);
  }

  // write Developer Token to file
  fs.writeFile('./tmp/developerAPIToken.txt', token, err => {
    if (err) {
      console.error(err);
    }
    else {
      console.log("Developer API Key written to file successfully");
    }
  });

});

/**
 * get all songs from user library
 */
app.get("/getAllSongs", async function (req, res) {
  let filename1 = './tmp/developerAPIToken.txt';
  let filename2 = './tmp/userAPIToken.txt';

  const developerAPIToken = fs.readFileSync(filename1, 'utf8', function (err, data) {
    if (err) throw err;
    // console.log('OK: ' + filename1);
    // console.log(data)
  }).toString().split('\n')[0];

  const userAPIToken = fs.readFileSync(filename2, function (err, data) {
    if (err) throw err;
    // console.log('OK: ' + filename2);
    // console.log(data)
  }).toString().split('\n')[0];

  const getData = async (url) => {
    let result = [];
    let jsonData = await helperLibrary.appleMusicApiURLWithTokens(appleMusicURL.appleMusicLibrarySongsURL, developerAPIToken, userAPIToken);
    let nextURL = jsonData.next;

    while (nextURL !== null &&
      nextURL !== undefined &&
      nextURL !== '') {
      // turn on to see if the offset is incrementing
      console.log("current url:", nextURL);
      // console.log(jsonData.meta.total);
      result.push(...jsonData.data);
      nextURL = jsonData.next;
      // console.log(jsonData.data);
      let newURL = `https://api.music.apple.com/${nextURL}`
      jsonData = await helperLibrary.appleMusicApiURLWithTokens(newURL, developerAPIToken, userAPIToken);
    }

    return result;
  }

  let artistData = await getData(appleMusicURL.appleMusicLibrarySongsURL);

  // write the API response to file to see results
  fs.writeFile('./tmp/tempLibraryDB.json', JSON.stringify(artistData), err => {
    if (err) {
      console.error(err);
    }
    else {
      console.log("file written successfully");
    }
  });
});

/**
 * get all playlists from user library
 */
app.get("/getAllPlaylists", async function (req, res) {
  let filename1 = './tmp/developerAPIToken.txt';
  let filename2 = './tmp/userAPIToken.txt';

  const developerAPIToken = fs.readFileSync(filename1, 'utf8', function (err, data) {
    if (err) throw err;
    // console.log('OK: ' + filename1);
    // console.log(data)
  }).toString().split('\n')[0];

  const userAPIToken = fs.readFileSync(filename2, function (err, data) {
    if (err) throw err;
    // console.log('OK: ' + filename2);
    // console.log(data)
  }).toString().split('\n')[0];

  const getData = async (url) => {
    let result = [];
    let jsonData = await helperLibrary.appleMusicApiURLWithTokens(appleMusicURL.appleMusicLibraryPlaylistsURL, developerAPIToken, userAPIToken);
    let nextURL = jsonData.next;

    while (nextURL !== null &&
      nextURL !== undefined &&
      nextURL !== '') {
      // turn on to see if the offset is incrementing
      // console.log(jsonData.data);
      console.log("current url:", nextURL);
      // console.log(jsonData.meta.total);
      result.push(...jsonData.data);
      nextURL = jsonData.next;
      let newURL = `https://api.music.apple.com/${nextURL}`
      jsonData = await helperLibrary.appleMusicApiURLWithTokens(newURL, developerAPIToken, userAPIToken);
    }

    return result;
  }
  // change the URL in each endpoint
  let libraryData = await getData(appleMusicURL.appleMusicLibraryPlaylistsURL);

  // write the API response to file to see results
  fs.writeFile('./tmp/userPlaylists.json', JSON.stringify(libraryData), err => {
    if (err) {
      console.error(err);
    }
    else {
      console.log("file written successfully");
    }
  });

});

/**
 * 
 */
app.post("/createNewPlaylist", function (req, res) {
});

/**
 * 
 */
app.get("/refreshDatabase", function (req, res) {
  JSONData.forEach(element => {
    client.query(
      `INSERT INTO Songs
            (
                id, type, href, 
                album_name, track_number, duration_in_ms, 
                release_date, disc_number, has_credits, 
                has_lyrics, name, artist_name, content_rating
            )
            VALUES
            (
                $1, $2, $3,
                $4, $5, $6,
                $7, $8, $9,
                $10, $11, $12, $13
            ) 
            RETURNING *
        `,
      [
        element.id,
        element.type,
        element.href,
        element.attributes.albumName,
        element.attributes.trackNumber,
        element.attributes.durationInMillis,
        element.attributes.releaseDate,
        element.attributes.discNumber,
        element.attributes.hasCredits,
        element.attributes.hasLyrics,
        element.attributes.name,
        element.attributes.artistName,
        element.attributes.contentRating
      ],
      (err, results) => {
        console.log(results);
      });

    client.query(
      `INSERT INTO Genres
            (
              id, song_id, genre_name 
            )
            VALUES
            (
                DEFAULT, $1, $2
            ) 
            RETURNING *
        `,
      [
        element.id,
        element.attributes.genreNames
      ],
      (err, results) => {
        console.log(results);
      });

    // client.query(
    //   `INSERT INTO Artwork
    //         (
    //             id, song_id, width, height, 
    //             url 
    //         )
    //         VALUES
    //         (
    //             DEFAULT, $1, $2,
    //             $3, $4
    //             ) 
    //         RETURNING *
    //     `,
    //   [
    //     element.id,
    //     element.attributes.artwork.width,
    //     element.attributes.artwork.height,
    //     element.attributes.artwork.url
    //   ],
    //   (err, results) => {
    //     console.log(results);
    //   });
    // client.query(
    //       `INSERT INTO PlayParams
    //         (
    //             song_id, is_library, 
    //             reporting, catalog_id, reporting_id 
    //         )
    //         VALUES
    //         (
    //             $1, $2, $3,
    //             $4, $5
    //         ) 
    //         RETURNING *
    //     `,
    //   [
    //     element.attributes.id,
    //     // element.attributes.playParams.kind,
    //     element.attributes.playParams.isLibrary,
    //     element.attributes.playParams.reporting,
    //     element.attributes.playParams.catalogId,
    //     element.attributes.playParams.reportingId
    //   ],
    //   (err, results) => {
    //     console.log(results);
    //   });
  });
});

/**
 * get all available genres from db
*/
app.get("/db/getAllGenres", function (req, res) {
  client.query(`
    SELECT DISTINCT genre_name FROM genres;
    `, (err, results) => {
    if (err) throw err;
    res.send(results.rows);
  });
});

/**
 * get all available artists from db
 */
app.get("/db/getAllArtistNames", function (req, res) {
  client.query(`
    SELECT DISTINCT artist_name FROM songs;
    `, (err, results) => {
    if (err) throw err;
    res.send(results.rows);
  });
});

/**
 * get all available albums from db
 */
app.get("/db/getAllAlbumNames", function (req, res) {
  client.query(`
    SELECT DISTINCT album_name FROM songs;
    `, (err, results) => {
    if (err) throw err;
    res.send(results.rows);
  });
});

/**
 * get all songs matching album name
*/
app.post("/db/getMatchingSongsAlbum", function (req, res) {
  console.log(req.body);
  client.query(
    // `SELECT * FROM songs WHERE album_name = $1`
    `SELECT * FROM songs
         WHERE songs.artist_name IN ('Goldfinger', 'Eve 6', 'Soundgarden',
                                     '311', 'Primal Scream', 'Helmet',
                                     'Stone Temple Pilots', 'Rage Against the Machine', 'Red Hot Chili Peppers',
                                     'Fatboy Slim', 'Nirvana', 'Infectious Grooves',
                                     'Better Than Ezra', 'New Radicals', 'Pearl Jam',
                                     'Jamiroquai', 'Everclear', 'Lit', 'Jane''s Addiction',
                                    'Living Colour', 'Nine Inch Nails', 'Cypress Hill', 'Spin Doctors',
                                    'Blur', 'The Sundays', 'Foo Fighters', 'Third Eye Blind', 'Gin Blossoms',
                                    'Beck', 'Pond', 'Jellyfish', 'Collective Soul', 'Porno for Pyros',
                                    'The Smashing Pumpkins', 'Candlebox', 'The Breeders', 'Counting Crows',
                                    'Mustard Plug', 'Toadies', 'Alice In Chains', 'Jawbreaker', 'Hole',
                                    'The Offspring', 'Weezer', 'Beastie Boys', 'NOFX', 'R.E.M.', 'Bush',
                                    'Qasis', 'Guru', 'Alice In Chains', 'Silverchair', 'The Urge', 'Garbage',
                                    'Dishwalla', 'Spacehog', 'Semisonic', 'Veruca Salt', 'The Suicide Machines',
                                    'Pain', 'Gin Blossoms', 'Rage Against the Machine', 'Fun Lovin'' Criminals',
                                    'Hootie & The Blowfish', 'Butthole Surfers', 'Savage Garden', 'Sublime',
                                    'Fiona Apple', 'Reel Big Fish', 'CAKE', 'Corrosion of Conformity', 'Jimmie''s Chicken Shack',
                                    'The Dandy Warhols', 'L7', 'American Football', 'Our Lady Peace', 'Vertical Horizon',
                                    'blink-182', 'Moby', 'Dido', 'Citizen King', 'Blessid Union of Souls', 'Hole',
                                    'bôa', 'Fuel', 'Train', 'Butthole Surfers', 'Dada', 'Temple of the Dog',
                                    'The Cranberries','Blind Melon', 'Gin Blossoms', 'Sonic Youth', 'LIVE',
                                    'Meat Puppets', 'The Presidents of the United States of America', 'No Doubt',
                                    'Liz Phair', 'Belly', 'The Breeders', 'Radiohead', 'Portishead', 'Green Day',
                                    'Soul Asylum', 'Alanis Morissette', 'Ani DiFranco', 'Screaming Trees', 'The Flaming Lips',
                                    'Imperial Teen', 'Jellyfish', 'The Juliana Hatfield Three', 'Paul Westerberg',
                                    'Seaweed', 'For Squirrels', 'Matthew Sweet')
            AND release_date BETWEEN '1989-01-01' AND '2000-01-01'
ORDER BY release_date;`
    ,
    // [
    //   req.body.album_name
    // ],
    (err, results) => {
      if (err) throw err;
      res.send(results.rows);
    }
  )
});

console.log(`Server listening on port ${port}!`);
app.listen(port, hostname);