const express = require('express');
const app = express();
const promise = require('bluebird');
const portNumber = process.env.PORT || 3000;

// pg-promise initialization options:
const initOptions = {
  // Use a custom promise library, instead of the default ES6 Promise:
  promiseLib: promise, 
};

// Database connection parameters:
const config = {
  host: 'localhost',
  port: 5432,
  database: 'nutrition',
  user: 'brandonhill'
};

// Load and initialize pg-promise:
const pgp = require('pg-promise')(initOptions);

// Create the database instance:
const db = pgp(config);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static( __dirname + '/FrontEnd'));

app.get('/api/users', function (req, res) {
  db.query('SELECT * FROM users')
      .then(function (results) {
        results.forEach(function (users) {
          console.log(users.name);
        });

        res.json(results);
      });
});


app.post('/api/users', function (req, res) {
  if(req.body.name != '' && typeof req.body.name !== 'undefined') {
    db.query(`INSERT INTO users (name,age,height_in,weight_lbs,gender) VALUES ('${req.body.name}','${req.body.age}','${req.body.height_in}','${req.body.weight_lbs}','${req.body.gender}') RETURNING *`)
    .then(function (result) {
      console.log(result);
    });
    res.send('OK');
  }else {
    res.send('user needs a name');
  }
});

app.get('/api/intake', function (req, res) {
  db.query('SELECT * FROM intake')
      .then(function (results) {
        results.forEach(function (intake) {
          console.log(intake.food);
        });

        res.json(results);
      });
});

app.post('/api/intake', function (req, res) {
  if(req.body.food != '' && typeof req.body.food !== 'undefined') {
    db.query(`INSERT INTO intake (food,calories,carb_g,fat_g,pro_g,fiber) VALUES ('${req.body.food}','${req.body.calories}','${req.body.carb_g}','${req.body.fat_g}','${req.body.pro_g}','${req.body.fiber}') RETURNING *`)
    .then(function (result) {
      console.log(result);
    });
    res.send('OK');
  }else {
    res.send('user is missing intake');
  }
});




// app.get('/api/user_intake', function (req, res) {
//   db.query('SELECT artists.name AS artist_name, albums.name AS album_name, \
//   albums.release_date, albums.genre FROM artists \
//   JOIN albums_artists on albums_artists.artist_id = artists.id \
//   JOIN albums on albums.id = albums_artists.album_id')
//       .then(function (results) {
//         res.json(results);
//       });
// });

// app.post('/api/artists_albums', function (req, res) {

//   if ( req.body.name != '' && typeof req.body.name !== 'undefined' ) {
//     db.query(`SELECT artists.name AS artist_name, albums.name AS album_name, \
//     albums.release_date, albums.genre FROM artists \
//     JOIN albums_artists on albums_artists.artist_id = artists.id \
//     JOIN albums on albums.id = albums_artists.album_id WHERE artists.name = '${req.body.name}'`)
//         .then(function (results) {
//           res.json(results);
//         });
//   } else if ( req.body.album_id != '' && typeof req.body.album_id !== 'undefined' &&
//              req.body.artist_id != '' && typeof req.body.artist_id !== 'undefined') {

//     db.query(`INSERT INTO albums_artists("artist_id", "album_id") \
//     VALUES(${req.body.artist_id}, ${req.body.album_id})`)
//     .then(function (results) {
//       res.send('OK');
//     });

//   } else {
//     res.send('fail');
//   }   
// });

app.listen(portNumber, function() {
  console.log(`My API is listening on port ${portNumber}.... `);
});
