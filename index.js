
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
  host: 'lallah.db.elephantsql.com',
  port: 5432,
  database: 'bimpyezd',
  user: 'bimpyezd',
  password: 'oAbw-tCFognawMn-HuJdACfPrlK_apH8'
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
  SESSION_NAME = 'sid',
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
    res.redirect('/users')
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

//LANDING PAGE
app.get('/', function (req, res) {
  console.log(req.session)
  const { userId } = req.session

  res.render('index.ejs');
});

//USER PAGE AFTER LOGIN AUTHENTICATED
app.get('/users', redirectLogin, function (req, res) {
  console.log(req.sessionID)
  console.log('you are on/users page')

  let sessionData = {
    name: req.session.user.name
  }
  res.render('users.ejs', { name: `${sessionData.name}`});
});

//LOGIN PAGE
app.get('/login', redirectHome, function (req, res) {
  res.render('login.ejs')
});

//POST YOUR LOGIN CREDENTIALS 
app.post('/login', function (req, res) {
  if (req.body.email != '' && req.body.password != '') {
    console.log(req.body);
    let encryptedPass = encryptPassword(req.body.password);
    db.one(
      `SELECT * FROM users WHERE 
        email = '${req.body.email}' AND 
        password = '${encryptedPass}'`
    ).then(function (response) {
      console.log(response);

      req.session.user = response;

      return res.redirect('/users')

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

  if (req.body.name != '' && typeof req.body.name !== 'undefined') {

    let email = req.body.email

    db.query(`SELECT * FROM users WHERE email = '${email}'`)
      .then(function (results) {
        if (!results[0]) {
          let encryptedPass = encryptPassword(req.body.password);

          db.query(`INSERT INTO users (name,age,gender,height_in,weight_lbs,email,password)
          VALUES ('${req.body.name}','${req.body.age}','${req.body.gender}','${req.body.height_in}','${req.body.weight_lbs}','${email}','${encryptedPass}')
          RETURNING *`)
            .then(function (result) {
              console.log(result);
              res.send('result');

            })
        } else {
          res.send('this email is in use')
        }

      }

      );

  } else {
    res.send('user needs a name');
  }
});

//post food
app.get('/intake', function (req, res) {
  db.query(`SELECT * FROM intake
  LEFT JOIN users
  ON intake.user_id = users.id`)
    .then(function (results) {
      results.forEach(function (intake) {
        console.log(intake.food);
      });

      res.json(results);
    });
});

app.get('/calories', function(req,res){
  db.query(`SELECT SUM(calories)
  FROM intake
  WHERE user_id = ${req.session.user.id}
  AND is_deleted = FALSE; `)
    .then(function(results){
      res.json(results)
    })
})

app.get('/carbs', function(req,res){
  db.query(`SELECT SUM(carb_g)
  FROM intake
  WHERE user_id = ${req.session.user.id}
  AND is_deleted = FALSE; `)
    .then(function(results){
      res.json(results)
    })
})

app.get('/fats', function(req,res){
  db.query(`SELECT SUM(fat_g)
  FROM intake
  WHERE user_id = ${req.session.user.id}
  AND is_deleted = FALSE; `)
    .then(function(results){
      res.json(results)
    })
})

app.get('/protein', function(req,res){
  db.query(`SELECT SUM(pro_g)
  FROM intake
  WHERE user_id = ${req.session.user.id}; `)
    .then(function(results){
      res.json(results)
    })
})

app.post('/intake', function (req, res) {
  console.log('look here', req.session.user.id)
  db.query(`INSERT INTO intake (food,calories,carb_g,fat_g,pro_g,fiber,user_id,is_deleted)
    VALUES ('${req.body.food}','${req.body.calories}','${req.body.carb_g}','${req.body.fat_g}','${req.body.pro_g}','${req.body.fiber}','${req.session.user.id}','FALSE') RETURNING *`)
    .then(function (result) {
      console.log(result);
      res.send('OK')
    });

});

//update user data

app.put('/userdata', function (req, res) {
  console.log(req.session.user.id)
  db.query(`UPDATE users
  SET name ='${req.body.name}',
  age = '${req.body.age}',
  height_in = '${req.body.height_in}',
  weight_lbs = '${req.body.weight_lbs}',
  gender = '${req.body.gender}'
  
  WHERE id = '${req.session.user.id}'`)
    .then(function (results) {
      console.log(req.session)
      res.send('something')
    }
    )

})

// retrieve user data for user.ejs display
app.get('/userdata', function (req, res) {
  console.log("welcome", req.session.user.name)
  db.query(`SELECT * FROM users WHERE id = '${req.session.user.id}'`)
    .then(function (results) {
      console.log('current', results)
      res.send(results)
    })
})

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

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect('/');
  });

});


// router.use('/webRoutes', webRoutes)

//APP PORT LISTEN
app.listen(portNumber, function () {
  console.log(`My API is listening on port ${portNumber}.... `);
});

