const express = require('express');
const app = express();
const promise = require('bluebird');
const portNumber = process.env.PORT || 3000;
const session = require('express-session');
const pbkdf2 = require('pbkdf2');

// const webRoutes = ('/api/webRoutes')
// const router = express.Router()

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

//Calls ejs template and allows web folder to hold all javascript/image files
app.set('view-engine', 'ejs')
app.use(express.static(__dirname + '/web'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//const for our cookie
const {
  PORT = 3000,
  NODE_ENV = 'development',
  SESSION_NAME= 'sid',
  SESSION_SECRET = 'tacocat',
  SESSION_LIFETIME = 60000
} = process.env

const IN_PRODUCTION = NODE_ENV === 'PRODUCTION'


//session
app.use(session({
  
  name: SESSION_NAME,
  resave: false,
  saveUninitialized: false,
  secret: SESSION_SECRET,
  cookie: {
     maxAge: SESSION_LIFETIME,
     sameSite: true,
     secure: IN_PRODUCTION
    }
    
}));


//encrypts password
function encryptPassword(password) {
  var key = pbkdf2.pbkdf2Sync(
    password, "la7sdycfoialwbdfalwie7f", 36000, 256, 'sha256'
  );
  return hash = key.toString('hex');
}

//user authentication
function redirectLogin(req, res, next) {
  // if user is authenticated let request pass
  if (req.session.user) {
    next();
  } else { // user is not authenticated send them to login
    console.log('USER NOT ATHENTICATED. PLEASE LOGIN OR REGISTER FIRST!');
    res.redirect('/');
  }
}

// redirects if user id is already authenticated
function redirectHome(req, res, next) {
  if (req.session.user) {
    res.render('/users')
  } else {
    next()
  }
}

function authorizedFinancialMiddleware(req, res, next) {
  if (req.session.user.role != 'accounting') {
    res.send('Access not authorized please contact accounting');
  } else {
    next();
  }
}

//userId check

// app.use((req,res,next) => {
//   const { userId } = req.session
  
//   if (userId) {
//     res.locals.user = 
//   }
// })

//LANDING PAGE
app.get('/', function (req, res) {
  console.log(req.session)
  const { userId } = req.session 

  res.render('index.ejs');
});

//USER PAGE AFTER LOGIN AUTHENTICATED
app.get('/user', redirectLogin, function (req, res) {
  console.log(req.sessionID)
  res.render('user.ejs');
});

//LOGIN PAGE
app.get('/login', redirectHome, function (req, res) {
  res.render('login.ejs')
});

//POST YOUR LOGIN CREDENTIALS 
app.post('/login', redirectHome, function (req, res) {
  if( req.body.email && req.body.password ) {
    console.log(req.body);
    let encryptedPass = encryptPassword(req.body.password);
    db.one(
      `SELECT * FROM users WHERE 
      email = '${req.body.email}' AND 
      password = '${encryptedPass}'`
      ).then(function (response) {
        console.log(response);
       
        req.session.user = response;
        
        return res.render('user.ejs')
        
      }).catch(function (error) {
        console.log(error);
        res.send('error');
      });
  } else {
    res.send('Please send a username and password');
  }
})


//REGISTER PAGE
app.get('/register', redirectHome, function (req, res) {
  res.render('register.ejs');
});

//REGISTER YOUR INFO TO OUR WEBSITE / DATABASE ROUTE
app.post('/register', redirectHome, function (req, res) {

  if( req.body.name && req.body.password && req.body.email) {

    if (req.body.email == db.query(`SELECT * FROM users WHERE email = '${req.body.email}'`)){
      alert('this username is already taken')
    }
    let encryptedPass = encryptPassword(req.body.password);
    db.query(`INSERT INTO users (name, email, password) 
    VALUES ('${req.body.name}', '${req.body.email}','${encryptedPass}')`)
    .then(function (response) {
      console.log(response);
      
      
      res.render('login.ejs')

    }).catch(function (error){
      console.log(error);
      // res.send('error');
    })

  } else {
    res.send('Please send a username and password');
  }
});

// app.get('/dashboard', authenticatedMiddleware, function (req, res) {
//   res.send('Secret Info for: ' + req.session.user.username);
// });

// app.get('/financials', authenticatedMiddleware, authorizedFinancialMiddleware, function (req, res) {
//   res.send('This comany has 1 million dollarz');
// });

//LOGS USER OUT
// app.get('/logout',redirectLogin, function (req,res, next) {
//   req.session.destroy(error => {
//     if (error) {
//       return res.redirect('/user')
//       console.log(error)
//     }

//     res.clearCookie(SESSION_NAME)
//     res.render('/')
//   })
//   console.log("You are now logged out of your session")
// })

//LOGS USER OUT
  // app.get('/logout', redirectLogin, function (req, res, next) {
  //   if (req.sessoin){
  //     req.session.destroy(function(error) {
  //       if(error) {
  //         return next(error);
  //       } else {
  //         return res.redirect('/');
  //       }
  //     })
  //   }
  // });

app.get('/logout',(req,res) => {
  req.session.destroy((err) => {
      if(err) {
          return console.log(err);
      }
      res.redirect('/');
  });

});


// router.use('/webRoutes', webRoutes)

//APP PORT LISTEN
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