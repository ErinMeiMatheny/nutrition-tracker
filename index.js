const express = require('express');
const app = express();
const promise = require('bluebird');
const portNumber = process.env.PORT || 3000;
const session = require('express-session');
const pbkdf2 = require('pbkdf2');
const flash = require('connect-flash');

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
  SESSION_LIFETIME = 600000
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

app.use(flash());

//Flash Messages 
app.use((req, res, next) => {
  res.locals.message = req.session.message
  delete req.session.message
  next()
})

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
  res.render('users.ejs', { name: `${sessionData.name}` });
});

//LOGIN PAGE
app.get('/login', redirectHome, function (req, res) {
  res.render('login.ejs')
});

//POST YOUR LOGIN CREDENTIALS 
app.post('/login', (req, res) => {

  let user = req.body.email;
  let password = req.body.password;
  let userOnFile = db.one(`SELECT * FROM users WHERE email = '${req.body.email}'`);
  let encryptedPass = encryptPassword(password);

  if (user == '' || password == '') {
    req.session.message = {
      type: 'danger',
      intro: 'Missing field!',
      message: 'Please ensure you enter both an email and password!'
    }
    res.redirect('/login')
  }

  else {

    db.one(
      `SELECT * FROM users WHERE 

email = '${req.body.email}' AND 
password = '${encryptedPass}'`)


      .then(function (response) {

        console.log(response);
        req.session.user = response;
        return res.redirect('/users')


      }).catch(function (error) {
        console.log(error);
        req.session.message = {
          type: 'danger',
          intro: 'Incorrect Password',
          message: 'Please ensure you enter both an email and password!'
        }
        res.redirect('/login')

      });

  }
});


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
  db.query(`SELECT * FROM users
  RIGHT JOIN intake
  ON intake.user_id = users.id
  WHERE is_deleted = FALSE
  AND user_id = ${req.session.user.id}`)
    .then(function (results) {
      results.forEach(function (intake) {
        console.log(intake.food);
      });

      res.json(results);
    });
});

app.get('/calories', function (req, res) {
  db.query(`SELECT SUM(calories)
  FROM intake
  WHERE user_id = ${req.session.user.id}
  AND is_deleted = FALSE; `)
    .then(function (results) {
      res.json(results)
    })
})

app.get('/carbs', function (req, res) {
  db.query(`SELECT SUM(carb_g)
  FROM intake
  WHERE user_id = ${req.session.user.id}
  AND is_deleted = FALSE; `)
    .then(function (results) {
      res.json(results)
    })
})

app.get('/fats', function (req, res) {
  db.query(`SELECT SUM(fat_g)
  FROM intake
  WHERE user_id = ${req.session.user.id}
  AND is_deleted = FALSE; `)
    .then(function (results) {
      res.json(results)
    })
})

app.get('/protein', function (req, res) {
  db.query(`SELECT SUM(pro_g)
  FROM intake
  WHERE user_id = ${req.session.user.id} 
  AND is_deleted = FALSE;`)
    .then(function (results) {
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

//delete food
app.put('/deleteItem', function (req, res) {
  db.query(`UPDATE intake
  SET is_deleted = TRUE
  WHERE id = ${req.body.id}`)
    .then(function (results) {
      console.log(req)
      res.json("OK")
    })
});
//update user data

app.put('/userdata', function (req, res) {
  console.log(req.session.user.id)
  db.query(`UPDATE users
  SET age = '${req.body.age}',
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
      console.log('current', req.session)
      res.send(results)
    })
})

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

