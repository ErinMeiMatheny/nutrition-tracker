const express = require('express');
const app = express();
const promise = require('bluebird');
const portNumber = process.env.PORT || 3000;
const session = require('express-session');
const pbkdf2 = require('pbkdf2');

// pg-promise initialization options:
const initOptions = {
  // Use a custom promise library, instead of the default ES6 Promise:
  promiseLib: promise, 
};

// Database connection parameters:
const config = {
  host: 'localhost',
  port: 5432,
  database: 'password',
  user: 'urias'
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

function authorizedFinancialMiddleware(req, res, next) {
  if (req.session.user.role != 'accounting') {
    res.send('Access not authorized please contact accounting');
  } else {
    next();
  }
}

app.get('/', function (req, res) {
  res.render('./public/index.html');
});

app.get('/login', function (req, res) {
  res.send('Please login');
});

app.post('/login', function (req, res) {
  if( req.body.username && req.body.password ) {
    console.log(req.body);
    let encryptedPass = encryptPassword(req.body.password);
    db.one(
      `SELECT * FROM users WHERE 
      username = '${req.body.username}' AND 
      password = '${encryptedPass}'`
      ).then(function (response) {
        console.log(response);
        
        req.session.user = response;

        res.send('worked');
      }).catch(function (error) {
        console.log(error);
        res.send('error');
      });
  } else {
    res.send('Please send a username and password');
  }
})

app.get('/sign-up', function (req, res) {
  res.send('please sign up');
});

app.post('/sign-up', function (req, res) {

  if( req.body.username && req.body.password ) {

    let encryptedPass = encryptPassword(req.body.password);
    db.query(`INSERT INTO users (username, password, role) 
    VALUES ('${req.body.username}', '${encryptedPass}', 'user')`)
    .then(function (response) {
      console.log(response);
      res.send('success');
    }).catch(function (error){
      console.log(error);
      res.send('error');
    })

  } else {
    res.send('Please send a username and password');
  }
});

app.get('/dashboard', authenticatedMiddleware, function (req, res) {
  res.send('Secret Info for: ' + req.session.user.username);
});

app.get('/financials', authenticatedMiddleware, authorizedFinancialMiddleware, function (req, res) {
  res.send('This comany has 1 million dollarz');
});

app.listen(portNumber, function() {
  console.log(`My API is listening on port ${portNumber}.... `);
});



































// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config()
// }

// const express = require('express')
// const app = express()
// const bcrypt = require('bcrypt')
// const passport = require('passport')
// const flash = require('express-flash')
// const session = require('express-session')
// const methodOverride = require('method-override')

// const initializePassport = require('./passport-config')
// initializePassport(
//   passport,
//   email => users.find(user => user.email === email),
//   id => users.find(user => user.id === id)
// )

// //static hosting for web folder
// app.use(express.static(__dirname + '/web'));

// const initOptions = {
//   // Use a custom promise library, instead of the default ES6 Promise:
//   promiseLib: promise,
// };

// // Database connection parameters:
// const config = {
//   host: 'localhost',
//   port: 5432,
//   database: 'twitter',
//   user: 'urias'
// };

// // Load and initialize pg-promise:
// const pgp = require('pg-promise')(initOptions);

// // Create the database instance:
// const db = pgp(config);

// const users = []

// app.set('view-engine', 'ejs')
// app.use(express.urlencoded({ extended: false }))
// app.use(flash())
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false
// }))
// app.use(passport.initialize())
// app.use(passport.session())
// app.use(methodOverride('_method'))

// app.get('/', checkAuthenticated, (req, res) => {
//   res.render('index.ejs', { name: req.user.name })
// })

// app.get('/login', checkNotAuthenticated, (req, res) => {
//   res.render('login.ejs')
// })

// app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect: '/login',
//   failureFlash: true
// }))

// app.get('/register', checkNotAuthenticated, (req, res) => {
//   res.render('register.ejs')
// })

// app.post('/register', checkNotAuthenticated, async (req, res) => {
 
//   db.query(`INSERT INTO users (name, age,height_in, weight_lbs, gender, email, password) VALUES ('${req.body.name}','${req.body.height_in}','${req.body.weight_lbs}','${req.body.gender}','${req.body.email}','${req.body.password}'`)
 
//   try {
//     const hashedPassword = await bcrypt.hash(req.body.password, 10)
//     users.push({
//       id: Date.now().toString(),
//       name: req.body.name,
//       email: req.body.email,
//       password: hashedPassword
//     })
//     res.redirect('/login')
//   } catch {
//     res.redirect('/register')
//   }
// })

// app.delete('/logout', (req, res) => {
//   req.logOut()
//   res.redirect('/login')
// })

// function checkAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next()
//   }

//   res.redirect('/login')
// }

// function checkNotAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return res.redirect('/')
//   }
//   next()
// }

// app.listen(3000)