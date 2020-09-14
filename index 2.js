const express = require('express');
const app = express();
const promise = require('bluebird');
<<<<<<< HEAD
var bodyParser = require('body-parser')
<<<<<<< HEAD

app.set("view-engine", "html")
// const bcrypt = require('bcrypt');

// const sequalizeDB = require("./models")
=======
const bcrypt = require('bcrypt');

const sequelizeDB = require("./models");
>>>>>>> erin

//Used for adding extra security
const saltRounds = 10;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

=======
>>>>>>> erin
const portNumber = process.env.PORT || 3000;

// pg-promise initialization options:
const initOptions = {
  // Use a custom promise library, instead of the default ES6 Promise:
  promiseLib: promise, 
};

// Database connection parameters:
const config = {
<<<<<<< HEAD
    host: 'localhost',
    port: 5432,
    database: 'nutrition',
<<<<<<< HEAD
    user: 'urias'
=======
    user: 'erin'
>>>>>>> erin
=======
  host: 'localhost',
  port: 5432,
  database: 'nutrition',
  user: 'erin'
>>>>>>> erin
};

// Load and initialize pg-promise:
const pgp = require('pg-promise')(initOptions);

// Create the database instance:
const db = pgp(config);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

<<<<<<< HEAD
app.use(express.static(__dirname + '/web'));

let timestamp = new Date().toLocaleDateString()

<<<<<<< HEAD



//returns non-deleted tweets
app.get('/api/posts', function (req, res) {
    db.query('SELECT * FROM posts WHERE is_tweet_deleted = FALSE')
        .then(function (results) {
            results.forEach(function (results) {
                console.log(results.tweet);
            });

            res.json(results);
        })

});

//user authentication
app.get('/api/users', (req, res) => {
    sequalizeDB.user.findAll()
=======
//user authentication
// app.get('/', (req, res) => {
//     res.json(users);
// })
app.get('/users', (req, res) => {
    sequelizeDB.user.findAll()
>>>>>>> erin
        .then((results) => {
            res.json(results);
        })
})


<<<<<<< HEAD
app.get('/api/users/:id', (req, res) => {

    let id = req.params.id;

    sequalizeDB.user.findByPk(id).then(function (user) {
        res.json(user);
    })

})




app.post('/register', (req, res) => {
    sequalizeDB.user.create({ firstName: 'Eric', lastName: 'Fisher', email: 'me@me.com' })
        .then(function (user) {
            console.log(user);
        });
=======
//register user


app.post('/api/register', (req, res) => {
>>>>>>> erin
    if (!req.body.email) {
        res.status(404).send("Email is required");
    }
    if (!req.body.password) {
        res.status(404).send("Password is required");
<<<<<<< HEAD
    }
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    bcrypt.hash(password, saltRounds, function (err, hash) {
        sequalizeDB.user.create({ username: username, email: email, password: hash })
            .then(function (user) {
                res.json({ status: "Successful Registration" });
            });
    });
})



=======
    } if (!req.body.username) {
        res.status(404).send("Username is required");
    }

    var email = req.body.email;
    var password = req.body.password;
    var username = req.body.username;

    db.query(`SELECT * FROM users WHERE email = '${email}'`)
        .then(function (results) {
            if (!results[0]) {
                bcrypt.hash(password, saltRounds, function (err, hash) {
                    // Store hash in your password DB.
                    password = hash;
                    console.log(email, password)

                    sequelizeDB.user.create({ username: username, email: email, password: hash })
                        .then(function (user) {
                            console.log(user)
                            res.json({ status: "Successful Registration" });
                        });
                })
            } else {
                res.send('use a different email')
            };
        })


})
// app.post('/api/register', (req, res) => {
//     if (!req.body.email) {
//         res.status(404).send("Email is required");
//     }
//     if (!req.body.password) {
//         res.status(404).send("Password is required");
//     }
//     var username = req.body.username;
//     var email = req.body.email;
//     var password = req.body.password;
//     bcrypt.hash(password, saltRounds, function (err, hash) {
//         db.user.create({ username: username, email: email, password: hash })
//             .then(function (user) {
//                 res.json({ status: "Successful Registration" });
//             });
//     });
// })
>>>>>>> erin


app.post('/api/login', (req, res) => {
    if (!req.body.email) {
        res.status(404).send("Email is required");
    }
    if (!req.body.password) {
        res.status(404).send("Password is required");
    }
    // if (!users[req.body.email]) {
    //     res.status(404).send("User does not exist in the database");
    // }

    var email = req.body.email;
    var password = req.body.password;
    // var stored_password = users[email];

    db.query(`SELECT * FROM users WHERE email = '${email}'`)
        .then(function (results) {

            console.log(results)

            bcrypt.compare(password, results[0].password, function (err, result) {
                // result == true
                if (result == true) {
                    res.json({ status: "User has successfully loged in", results });
                } else {
                    res.status(404).send("Email/Password combination did not match");
                }
            });
        })

})

<<<<<<< HEAD
=======
//returns non-deleted tweets
app.get('/api/posts', function (req, res) {
    db.query('SELECT * FROM posts WHERE is_tweet_deleted = FALSE')
        .then(function (results) {
            results.forEach(function (results) {
                console.log(results.tweet);
            });

            res.json(results);
        })

});


>>>>>>> erin
//make a tweet
app.post('/api/posts', function (req, res) {
    if (req.body.tweet != '' && typeof req.body.tweet !== 'undefined' && req.body.user_tweet != '') {
        db.query(`INSERT INTO posts (tweet, user_tweet, date_of_tweet, is_tweet_deleted) VALUES ('${req.body.tweet}','${req.body.user_tweet}', '${timestamp}','FALSE') RETURNING *`)
            .then(function (result) {
                console.log(result);
            });
        res.send('tweet exists');
    } else {
        res.send('Enter a tweet');
    }
=======
app.use(express.static( __dirname + '/web'));

app.get('/api/users', function (req, res) {
  db.query('SELECT * FROM users')
      .then(function (results) {
        results.forEach(function (users) {
          console.log(users.name);
        });
>>>>>>> erin

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

<<<<<<< HEAD
<<<<<<< HEAD
=======
//retrieve a single user
app.get('/api/users/:id', (req,res) => {
    let id = req.params.id;
    sequelizeDB.user.findByPk(id).then(function(user){
        res.json(user);
    })
})

>>>>>>> erin
//delete a single tweet
app.post(`/api/posts/:id`, function (req, res) {
    db.query(`UPDATE posts SET is_tweet_deleted = 'TRUE' WHERE id = ${req.params.id} AND user_tweet = '${req.body.user_tweet}'`)
        .then(function (results) {
            res.json(results);
            // console.log(results[0].tweet);
        })
=======
app.get('/api/intake', function (req, res) {
  db.query('SELECT * FROM intake')
      .then(function (results) {
        results.forEach(function (intake) {
          console.log(intake.food);
        });
>>>>>>> erin

        res.json(results);
      });
});

app.post('/api/intake', function (req, res) {
    db.query(`INSERT INTO intake (food,calories,carb_g,fat_g,pro_g,fiber,is_deleted) VALUES ('${req.body.food}','${req.body.calories}','${req.body.carb_g}','${req.body.fat_g}','${req.body.pro_g}','${req.body.fiber}','FALSE') RETURNING *`)
    .then(function (result) {
      console.log(result);
    });
    res.send('OK');
  
});


app.get('/api/userdata', function (req, res) {
  if(req.body.id != '' && typeof req.body.id != undefined) {
    db.query(`SELECT id FROM users WHERE id = ${req.body.id}`)
      .then(function(result) {
          if(result.length != 0) {
              db.query(` SELECT * 
              FROM users FULL JOIN intake 
              ON users.id = intake.user_id
              WHERE users.id =${req.body.id}`)
                .then(function (result) {
                  console.log(result);
                  res.json(result);
              });
          }
          else {
              res.send('User not found');
          }
      })
  }else {
    res.send('Select a user');
  }
});

<<<<<<< HEAD
<<<<<<< HEAD





app.listen(portNumber, function () {
    console.log(`My API is listening on port ${portNumber}.... `);
});
=======
app.listen(portNumber, function () {
    console.log(`My API is listening on port ${portNumber}.... `);
});
>>>>>>> erin
=======

app.listen(portNumber, function() {
  console.log(`My API is listening on port ${portNumber}.... `);
});
>>>>>>> erin
