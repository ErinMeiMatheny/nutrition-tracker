const express = require('express');
const app = express();
const promise = require('bluebird');
const session = require('express-session');
const pbkdf2 = require('pbkdf2');

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
    user: 'erin'
};

// Load and initialize pg-promise:
const pgp = require('pg-promise')(initOptions);

// Create the database instance:
const db = pgp(config);

app.use(session({
    secret: process.env.SECRET_KEY || 'tacocat',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(__dirname + '/web'));

function encryptPassword(password) {
    var key = pbkdf2.pbkdf2Sync(
        password, "la7sdycfoialwbdfalwie7f", 36000, 256, 'sha256'
    );
    return hash = key.toString('hex');
}

function authenticatedMiddleware(req, res, next) {
    // if user is authenticated let request pass
    if (req.session.user) {
        next();
    } else { // user is not authenticated send them to login
        console.log('user not authenticated');
        res.redirect('/login');
    }
}

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
    if (req.body.name != '' && typeof req.body.name !== 'undefined') {

        let email = req.body.email

        db.query(`SELECT * FROM users WHERE email = '${email}'`)
        .then(function (results) {
        if (!results[0]) {
        db.query(`INSERT INTO users (name,email,password) VALUES ('${req.body.name}','${email}','${req.body.password}') RETURNING *`)
            .then(function (result) {
                console.log(result);
                res.send('OK');

            })} else {
                console.log('this email is in use')
            }
        
        }

        );
    
        } else {
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
    db.query(`INSERT INTO intake (food,calories,carb_g,fat_g,pro_g,fiber,is_deleted) VALUES ('${req.body.food}','${req.body.calories}','${req.body.carb_g}','${req.body.fat_g}','${req.body.pro_g}','${req.body.fiber}','FALSE') RETURNING *`)
        .then(function (result) {
            console.log(result);
        });
    res.send('OK');

});


app.get('/api/userdata', function (req, res) {
    if (req.body.id != '' && typeof req.body.id != undefined) {
        db.query(`SELECT id FROM users WHERE id = ${req.body.id}`)
            .then(function (result) {
                if (result.length != 0) {
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
    } else {
        res.send('Select a user');
    }
});


app.listen(portNumber, function () {
    console.log(`My API is listening on port ${portNumber}.... `);
});