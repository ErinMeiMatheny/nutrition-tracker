const express = require('express');
const app = express();
const promise = require('bluebird');
var bodyParser = require('body-parser')
// const bcrypt = require('bcrypt');

// const sequalizeDB = require("./models")

//Used for adding extra security
const saltRounds = 10;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

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
    user: 'urias'
};

// Load and initialize pg-promise:
const pgp = require('pg-promise')(initOptions);

// Create the database instance:
const db = pgp(config);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(__dirname + '/web'));

let timestamp = new Date().toLocaleDateString()




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
        .then((results) => {
            res.json(results);
        })
})


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
    if (!req.body.email) {
        res.status(404).send("Email is required");
    }
    if (!req.body.password) {
        res.status(404).send("Password is required");
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

});

//retrieve a single tweet
app.get(`/api/posts/:id`, function (req, res) {
    db.query(`SELECT posts.id, tweet, reply
    FROM posts
    INNER JOIN replies
    ON posts.id = replies.opid
    WHERE posts.id = ${req.params.id}`)
        .then(function (results) {
            res.json(results);
            // console.log(results[0].tweet);
            // res.send(results.tweet)
        })

});

//delete a single tweet
app.post(`/api/posts/:id`, function (req, res) {
    db.query(`UPDATE posts SET is_tweet_deleted = 'TRUE' WHERE id = ${req.params.id} AND user_tweet = '${req.body.user_tweet}'`)
        .then(function (results) {
            res.json(results);
            // console.log(results[0].tweet);
        })

});

//creating a reply
app.post('/api/replies', function (req, res) {
    console.log(typeof timestamp)
    if (req.body.reply != '' && typeof req.body.reply !== 'undefined' && req.body.opid != '') {
        db.query(`INSERT INTO replies (opid, reply, date_of_reply, is_reply_deleted) VALUES ('${req.body.opid}','${req.body.reply}', '${timestamp}', 'FALSE') RETURNING *`)
            .then(function (result) {
                console.log(result);
                res.send(result[0].reply);
            });

    } else {
        res.send('Enter a reply');
    }

});

//delete a reply 
app.post(`/api/replies/:id`, function (req, res) {
    db.query(`UPDATE replies SET is_reply_deleted = 'TRUE' WHERE id = ${req.params.id}`)
        .then(function (results) {
            res.json(results);
        })

});






app.listen(portNumber, function () {
    console.log(`My API is listening on port ${portNumber}.... `);
});