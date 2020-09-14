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
    user: 'urias'
};

// Load and initialize pg-promise:
const pgp = require('pg-promise')(initOptions);

// Create the database instance:
const db = pgp(config);

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

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(__dirname + '/web'));

//this will allow static html pages to be viewable
app.set('view engine', 'html');

function encryptPassword(password) {
    var key = pbkdf2.pbkdf2Sync(
        password, "la7sdycfoialwbdfalwie7f", 36000, 256, 'sha256'
    );
    return hash = key.toString('hex');
}

// function authenticatedMiddleware(req, res, next) {
//     // if user is authenticated let request pass
//     if (req.session.user) {
//         next();
//     } else { // user is not authenticated send them to login
//         console.log('user not authenticated');
//         res.redirect('/login');
//     }
// }

// app.get('/api/users', function (req, res) {
//     db.query('SELECT * FROM users')
//         .then(function (results) {
//             results.forEach(function (users) {
//                 console.log(users.name);
//             });

//             res.json(results);
//         });
// });


// app.post('/api/users', function (req, res) {
//     if (req.body.name != '' && typeof req.body.name !== 'undefined') {
//         db.query(`INSERT INTO users (name,age,height_in,weight_lbs,gender) VALUES ('${req.body.name}','${req.body.age}','${req.body.height_in}','${req.body.weight_lbs}','${req.body.gender}') RETURNING *`)
//             .then(function (result) {
//                 console.log(result);
//                 res.send('OK');

//             });
//     } else {
//         res.send('user needs a name');
//     }
// });


// ------------------- BRYAN'S CODE START ---------------------------------
function redirectLogin(req, res, next) {
    // if user is authenticated let request pass
    if (req.session.user) {
      next();
    } else { // user is not authenticated send them to login
      console.log('user not authenticated');
      res.render('/');
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

  app.get('/', function (req, res) {
    console.log(req.session)
    const { userId } = req.session 
  
    res.write(`<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Bootstrap 4 Website</title>
    
        <!-- JQuery -->
        <script src="https://code.jquery.com/jquery-3.4.1.js"></script>
    
        <!-- Bootstrap 4.4.1 -->
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.css">
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.js"></script>
    
        <!-- Fontawesome 5.11.2 -->
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.11.2/css/all.css">
    
        <link rel="stylesheet" href="style.css">
    </head>
    <!------------------------------HEAD-------------------------------->
    
    <body>
        <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top">
            <a class="navbar-brand" href="#">
                <img src="./images/body-weighing-scale.jpg" width="30" height="30"
                    class="d-inline-block align-top" alt="" loading="lazy">
                fitness
            </a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
    
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <a class="nav-link" href="register">Register <span class="sr-only">(current)</span></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="login">Log In</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Dropdown
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <a class="dropdown-item" href="#">Action</a>
                            <a class="dropdown-item" href="#">Another action</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="#">Something else here</a>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
                    </li>
                </ul>
                <form class="form-inline my-2 my-lg-0">
                    <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
                    <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                </form>
            </div>
        </nav>
        <!-- Navigation -->
    
    
        <!---------------carousel------------->
        <div id="carouselExampleSlidesOnly" class="carousel slide" data-ride="carousel">
            <div class="carousel-inner">
                <div class="carousel-item active">
                    <img src="./images/healthyfoods.png" class="d-block w-100 h-50" alt="...">
                </div>
                <div class="carousel-item">
                    <img src="./images/differenct color fruits.jpg" class="d-block w-100 h-50" alt="...">
                </div>
                <div class="carousel-item">
                    <img src="./images/foods.jpg" class="d-block w-100 h-50" alt="...">
                </div>
            </div>
        </div>
    
        <!-- Content -->
        <div class="container-fluid p-0">
            <div class="jumbotron jumbotron-fluid bg-light">
                <div class="container ">
                    <div class='row'>
                        <input id="search" type="search" placeholder="Enter food" aria-label="Search">
                        <button id='searchButton' type="button" class="btn btn-light">Search Food</button>
                    </div>
                    <div id='results'>
    
                    </div>
                    <h1 class="display-4 text-center">Macros</h1>
                    <p class="lead"></p>
                </div>
            </div>
    
            <!-- cards -->
    
            <div class="card-deck p-5">
                <div class="card">
                    <img class="card-img-top" src="./images/healthy-protein.jpg"  alt="">
                    <div class="card-body">
                        <h6 class="card-title">Protein</h6>
                        <p class="card-text">
                            Protein is a macronutrient that is essential to building muscle mass.
                            It is commonly found in animal products, though is also present in other sources, such as nuts
                            and legumes.
                            There are three macronutrients: protein, fats and carbohydrates. Macronutrients provide
                            calories, or energy.
                        </p>
                        <hr>
                        <div class="text-center">
    
                            <h4>4 calories per gram</h4>
                            <p><a class="btn btn-outline-info" href="#">enter</a></p>
                        </div>
                    </div>
                </div>
    
                <div class="card">
                    <img class="card-img-top img-fluid height:auto" src="./images/healthy-carbs.jpg" height= "100" alt="">
                    <div class="card-body">
                        <h6 class="card-title">Crabs</h6>
                        <p class="card-text">
                            Carbohydrates are the sugars, starches and fibers found in fruits, grains, vegetables and milk
                            products.
                            Though often maligned in trendy diets, carbohydrates — one of the basic food groups — are
                            important to a healthy diet.
                        </p>
                        <hr>
                        <div class="text-center">
    
                            <h4>4 calories per gram</h4>
                            <p><a class="btn btn-outline-warning" href="#">enter</a></p>
                        </div>
                    </div>
                </div>
    
                <div class="card">
                    <img class="card-img-top" src="./images/Healthy-fats.jpg"  alt="">
                    <div class="card-body">
                        <h6 class="card-title">Fats</h6>
                        <p class="card-text">
                            The primary function of fat is as an energy reserve. The body stores fat, or adipose tissue, as
                            a result of excess calorie consumption.
                            During exercise, the body first uses calories from carbohydrates for energy. After about 20
                            minutes, it uses calories from stored fat to keep going.
                            Fats also help the body absorb necessary fat-soluble vitamins (vitamins A, D, E and K),
                        </p>
                        <hr>
                        <div class="text-center">
    
                            <h4>9 calories per gram</h4>
                            <p><a class="btn btn-outline-danger" href="#">enter</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-----------------------------footer------------------------------------------>
        <footer class="container-fluid bg-dark p-5">
            <div class="row">
                <div class="col-sm-3">
                    <h6 class="text-secondary">Home</h6>
                    <hr>
                    <h6 class="text-secondary">example</h6>
                    <p>
    
                    </p>
    
                    <h6 class="text-secondary">example</h6>
                    <p>
    
                    </p>
    
                    <h6 class="text-secondary">example</h6>
                    <p>
    
                    </p>
                </div>
    
                <div class="col-sm-3">
                    <h6 class="text-secondary">Blank#2</h6>
                    <hr>
                    <h6 class="text-secondary">example</h6>
                    <p>
    
                    </p>
    
                    <h6 class="text-secondary">example</h6>
                    <p>
    
                    </p>
    
                    <h6 class="text-secondary">example</h6>
                    <p>
    
                    </p>
    
                </div>
    
                <div class="col-sm-3">
                    <h6 class="text-secondary">Blank#3</h6>
                    <hr>
    
                    <h6 class="text-secondary">example</h6>
                    <p>
    
                    </p>
    
                    <h6 class="text-secondary">example</h6>
                    <p>
    
                    </p>
    
                    <h6 class="text-secondary">example</h6>
                    <p>
    
                    </p>
                </div>
    
                <div class="col-sm-3" id="contactAnchor">
                    <h6 class="text-secondary">Contact</h6>
                    <hr>
                    <p>
                        <i class="fas fa-envelope"></i> Fitness.com
                    </p>
                    <p>
                        <i class="fas fa-camera"></i> instagram
                        <br><i class="fab fa-facebook-square"></i> facebook
                        <br><i class="fab fa-twitter-square"></i> twitter
                        <br><i class="fab fa-google-plus-square"></i> google+
                    </p>
                </div>
    
            </div>
    
            <p class="text-center">Fitness &copy; 2020</p>
        </footer>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"
            integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
            crossorigin="anonymous"></script>
        <script type='text/javascript' src='app.js'></script>
        <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    </body>
    
    </html>`);
  });
  
  //USER PAGE AFTER LOGIN AUTHENTICATED
  app.get('/user', redirectLogin, function (req, res) {
    console.log(req.sessionID)
    res.write(`<!DOCTYPE html>
    <html lang="en">
  
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Welcome User</title>
  
        <!-- JQuery -->
        <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
  
        <!-- Bootstrap 4.4.1 -->
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>
  
        <!-- Fontawesome 5.11.2 -->
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.11.2/css/all.css">
  
        <link rel="stylesheet" href="user.css">
        <link rel="stylesheet" href="./css/style.css">
        <script src="./js/script.js"></script>
        <script src="app.js"></script>
      </head>
  <!------------------------------HEAD-------------------------------->
  
  <body class="user-page-body">
    <nav class="navbar navbar-expand-lg navbar-transparent bg- sticky-top ">
      <a class="navbar-brand" href="#">
        <img src="/fullstack-project/nutrition-tracker/web/images/body-weighing-scale.jpg" width="30" height="30"
          class="d-inline-block align-top" alt="" loading="lazy">
        fitness
      </a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
  
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <a class="nav-link" href="#">login <span class="sr-only">(current)</span></a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">register</a>
          </li>
          <!-----------
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Dropdown
              </a> 
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <a class="dropdown-item" href="#">Action</a>
                <a class="dropdown-item" href="#">Another action</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#">Something else here</a>
              </div>
              ----->
          </li>
          <li class="nav-item">
            <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">logout</a>
          </li>
        </ul>
  
      </div>
    </nav>
    <!-- Navigation -->
  
    <div class="modal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Modal body text goes here.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
    <br>
    <br>
    <br>
    <br>
    
    <!----------form -------------------------------------->
    <div class="container">
      
        <div class="d-flex justify-content-center">
          <form class="form-inline my-2 my-lg-0">
            <br>
            <div class='row'>
              <button id='searchButton' type="button" class="btn btn-outline-success">Search Food</button>
              <input id="search" type="search" placeholder="Enter food" aria-label="Search">
             
            </div>
            <div id='results'>
    
            </div>
            <!---
            <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            --->
          </form>
        </div>
        <br>
        
          <div class="container">
            <div class="row">
              <div class="form-group col-6">
                <input class="form-control form-control-lg col-sm-8" type="text" placeholder="name">
                <input class="form-control form-control-lg col-sm-8" type="text" placeholder="Gender">
                <input class="form-control form-control-lg col-sm-8" type="text" placeholder="Height">
                <input class="form-control form-control-lg col-sm-8" type="text" placeholder="Weight">
    
              </div>
    
              <div class="form-group col-6">
                <label for="exampleFormControlTextarea1"></label>
                <textarea class="form-control " id="exampleFormControlTextarea1" rows="6" placeholder="Your Results.."></textarea>
              </div>
            </div>
    
          </div>
      
      
    </div>
      
    
    <!---Diets Ideas-->
  
    <h1 class="display-4 text-center dieting">Dieting</h1>
              <p class="lead"></p>
  <hr>
       <!----carb cycling------->
  
      <div class="container is-fluid  has-text-centered carb-cycling pb-2">
        <div class="row">
            <div class="col-lg-6 p-2 my-auto">
                <h1 class='text-green p-4'>Carb Cycling</h1>
                <h4>What is Carb Cycling?
                  Carb cycling is a dietary approach in which you alternate carb intake on a daily, weekly or monthly basis.
                  
                  It is commonly used to lose fat, maintain physical performance while dieting, or overcome a weight loss plateau.
                  
                  Some people adjust their carb intake day-to-day, while others may do longer periods of low, moderate and high-carb diets.
                  
                  In short, carb cycling aims to time carbohydrate intake to when it provides maximum benefit and exclude carbs when they're not needed  </h4>
            </div>
  
            <div class="col-lg-6 p-5 my-auto">    
                  <div>
                     <img src="https://www.mymetabolicmeals.com/wp-content/uploads/2018/04/What-is-Carb-Cycling-blog-c.jpg" class="d-block w-100" alt="keto Dieting">
                  </div>            
            </div>
        </div>                            
      </div>
      
  
      <!---------Keto--------->
      <div class="container is-fluid  has-text-centered Keto pb-2">
        <div class="row">
            <div class="col-lg-6 p-5 my-auto">
                <h1 class='p-4'>Keto Dieting</h1>
                <h4>A keto or ketogenic diet is a low-carb, moderate protein, higher-fat diet that can help you burn fat more effectively.
                   It has many benefits for weight loss, health, and performance, as shown in over 50 studies. 
                   That's why it's recommended by so many doctors.</h4>
            </div>
            
            <div class="col-lg-6 p-5 my-auto">    
                  <div>
                     <img src="https://692671.smushcdn.com/1445505/wp-content/uploads/2020/01/Keto-Diet.jpg?lossy=0&strip=1&webp=0" class="d-block w-100" alt="keto Dieting">
                  </div>            
            </div>
        </div>                            
      </div>
  
      
  
      <!------intermitten fasting------>
      <div class="container is-fluid  has-text-centered intermitten-fasting pb-1">
        <div class="row">
            <div class="col-lg-6 p-3 my-auto">
                <h1 class='p-4'>Intermitten Fasting</h1>
                <h4> Intermittent fasting (IF) is an eating pattern that cycles between periods of fasting and eating. 
                  It doesn't specify which foods you should eat but rather when you should eat them. 
                  In this respect, it's not a diet in the conventional sense but more accurately described as an eating pattern</h4>
            </div>
            
            <div class="col-lg-6 p-5 my-auto">    
                  <div>
                     <img src="https://st1.thehealthsite.com/wp-content/uploads/2019/07/intermittent-diet-plan.jpg?impolicy=Medium_Resize&w=1200&h=800" class="d-block w-100" alt="keto Dieting">
                  </div>            
            </div>
        </div>                            
      </div>
      
  
      
    <!-----------------------------footer------------------------------------------>
  <footer class="container-fluid bg-dark p-5">
      <div class="row">
          <div class="col-sm-3">
              <h6 class="text-secondary">Home</h6>
              <hr>
              <h6 class="text-secondary">example</h6>
              <p>
                
              </p>
  
              <h6 class="text-secondary">example</h6>
              <p>
                  
              </p>
  
              <h6 class="text-secondary">example</h6>
              <p>
                  
              </p>
          </div>
  
          <div class="col-sm-3">
              <h6 class="text-secondary">Blank#2</h6>
              <hr>
              <h6 class="text-secondary">example</h6>
              <p>
                
              </p>
  
              <h6 class="text-secondary">example</h6>
              <p>
                  
              </p>
  
              <h6 class="text-secondary">example</h6>
              <p>
                  
              </p>
  
          </div>
  
          <div class="col-sm-3">
              <h6 class="text-secondary">Blank#3</h6>
              <hr>
  
              <h6 class="text-secondary">example</h6>
              <p>
                
              </p>
  
              <h6 class="text-secondary">example</h6>
              <p>
                  
              </p>
  
              <h6 class="text-secondary">example</h6>
              <p>
                  
              </p>
          </div>
  
          <div class="col-sm-3" id="contactAnchor">
              <h6 class="text-secondary">Contact</h6>
              <hr>
              <p>
                  <i class="fas fa-envelope"></i> Fitness.com
              </p>
              <p>
                  <i class="fas fa-camera"></i> instagram 
                  <br><i class="fab fa-facebook-square"></i> facebook 
                  <br><i class="fab fa-twitter-square"></i> twitter 
                  <br><i class="fab fa-google-plus-square"></i> google+ 
              </p>
          </div>
  
      </div>
  
      <p class="text-center">Fitness &copy; 2020</p>
  </footer>
    
  <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
  </body>
  
  
  </html>`);
  });
  
  //LOGIN PAGE
  app.get('/login', redirectHome, function (req, res) {
    res.write(`<!doctype html>
    <html lang="en">
    
    <head>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    
        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
            integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
    
        <title>Nutrition Tracker</title>
    </head>
    
    <body>
        <!-- START NAV -->
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="#">Navbar</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
    
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <a class="nav-link" href="index.html">Home <span class="sr-only">(current)</span></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="register.html">Register</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Dropdown
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <a class="dropdown-item" href="#">Action</a>
                            <a class="dropdown-item" href="#">Another action</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="#">Something else here</a>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
                    </li>
                </ul>
                <form class="form-inline my-2 my-lg-0">
                    <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
                    <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                </form>
            </div>
        </nav>
        <!-- END NAV -->
    
    
        <!-- START FORM -->
        <div class="container">
            <div class="row">
                <h1 class="display-2">Login</h1>
                <form action="/login" method="POST">
                    <div class="form-group">
                        <label for="email">Email address</label>
                        <input type="email" class="form-control" id="email">
                        <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone
                            else.</small>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Password</label>
                        <input type="password" class="form-control" id="exampleInputPassword1">
                    </div>
                    <button type="submit" class="btn btn-primary">Login</button>
                    <a href="/register">Register</a>
                </form>
    
            </div>
        </div>
    
        <!-- Optional JavaScript -->
        <!-- jQuery first, then Popper.js, then Bootstrap JS -->
        <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
            integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj"
            crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"
            integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN"
            crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"
            integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV"
            crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    
    </body>
    
    </html>`)
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
          
          return res.write(`<!DOCTYPE html>
          <html lang="en">
        
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta http-equiv="X-UA-Compatible" content="ie=edge">
              <title>Welcome User</title>
        
              <!-- JQuery -->
              <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
        
              <!-- Bootstrap 4.4.1 -->
              <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
              <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>
        
              <!-- Fontawesome 5.11.2 -->
              <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.11.2/css/all.css">
        
              <link rel="stylesheet" href="user.css">
              <link rel="stylesheet" href="./css/style.css">
              <script src="./js/script.js"></script>
              <script src="app.js"></script>
            </head>
        <!------------------------------HEAD-------------------------------->
        
        <body class="user-page-body">
          <nav class="navbar navbar-expand-lg navbar-transparent bg- sticky-top ">
            <a class="navbar-brand" href="#">
              <img src="/fullstack-project/nutrition-tracker/web/images/body-weighing-scale.jpg" width="30" height="30"
                class="d-inline-block align-top" alt="" loading="lazy">
              fitness
            </a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
        
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav mr-auto">
                <li class="nav-item active">
                  <a class="nav-link" href="#">login <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">register</a>
                </li>
                <!-----------
                  <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Dropdown
                    </a> 
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                      <a class="dropdown-item" href="#">Action</a>
                      <a class="dropdown-item" href="#">Another action</a>
                      <div class="dropdown-divider"></div>
                      <a class="dropdown-item" href="#">Something else here</a>
                    </div>
                    ----->
                </li>
                <li class="nav-item">
                  <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">logout</a>
                </li>
              </ul>
        
            </div>
          </nav>
          <!-- Navigation -->
        
          <div class="modal" tabindex="-1">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Modal title</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <p>Modal body text goes here.</p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary">Save changes</button>
                </div>
              </div>
            </div>
          </div>
          <br>
          <br>
          <br>
          <br>
          
          <!----------form -------------------------------------->
          <div class="container">
            
              <div class="d-flex justify-content-center">
                <form class="form-inline my-2 my-lg-0">
                  <br>
                  <div class='row'>
                    <button id='searchButton' type="button" class="btn btn-outline-success">Search Food</button>
                    <input id="search" type="search" placeholder="Enter food" aria-label="Search">
                   
                  </div>
                  <div id='results'>
          
                  </div>
                  <!---
                  <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
                  <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                  --->
                </form>
              </div>
              <br>
              
                <div class="container">
                  <div class="row">
                    <div class="form-group col-6">
                      <input class="form-control form-control-lg col-sm-8" type="text" placeholder="name">
                      <input class="form-control form-control-lg col-sm-8" type="text" placeholder="Gender">
                      <input class="form-control form-control-lg col-sm-8" type="text" placeholder="Height">
                      <input class="form-control form-control-lg col-sm-8" type="text" placeholder="Weight">
          
                    </div>
          
                    <div class="form-group col-6">
                      <label for="exampleFormControlTextarea1"></label>
                      <textarea class="form-control " id="exampleFormControlTextarea1" rows="6" placeholder="Your Results.."></textarea>
                    </div>
                  </div>
          
                </div>
            
            
          </div>
            
          
          <!---Diets Ideas-->
        
          <h1 class="display-4 text-center dieting">Dieting</h1>
                    <p class="lead"></p>
        <hr>
             <!----carb cycling------->
        
            <div class="container is-fluid  has-text-centered carb-cycling pb-2">
              <div class="row">
                  <div class="col-lg-6 p-2 my-auto">
                      <h1 class='text-green p-4'>Carb Cycling</h1>
                      <h4>What is Carb Cycling?
                        Carb cycling is a dietary approach in which you alternate carb intake on a daily, weekly or monthly basis.
                        
                        It is commonly used to lose fat, maintain physical performance while dieting, or overcome a weight loss plateau.
                        
                        Some people adjust their carb intake day-to-day, while others may do longer periods of low, moderate and high-carb diets.
                        
                        In short, carb cycling aims to time carbohydrate intake to when it provides maximum benefit and exclude carbs when they're not needed  </h4>
                  </div>
        
                  <div class="col-lg-6 p-5 my-auto">    
                        <div>
                           <img src="https://www.mymetabolicmeals.com/wp-content/uploads/2018/04/What-is-Carb-Cycling-blog-c.jpg" class="d-block w-100" alt="keto Dieting">
                        </div>            
                  </div>
              </div>                            
            </div>
            
        
            <!---------Keto--------->
            <div class="container is-fluid  has-text-centered Keto pb-2">
              <div class="row">
                  <div class="col-lg-6 p-5 my-auto">
                      <h1 class='p-4'>Keto Dieting</h1>
                      <h4>A keto or ketogenic diet is a low-carb, moderate protein, higher-fat diet that can help you burn fat more effectively.
                         It has many benefits for weight loss, health, and performance, as shown in over 50 studies. 
                         That's why it's recommended by so many doctors.</h4>
                  </div>
                  
                  <div class="col-lg-6 p-5 my-auto">    
                        <div>
                           <img src="https://692671.smushcdn.com/1445505/wp-content/uploads/2020/01/Keto-Diet.jpg?lossy=0&strip=1&webp=0" class="d-block w-100" alt="keto Dieting">
                        </div>            
                  </div>
              </div>                            
            </div>
        
            
        
            <!------intermitten fasting------>
            <div class="container is-fluid  has-text-centered intermitten-fasting pb-1">
              <div class="row">
                  <div class="col-lg-6 p-3 my-auto">
                      <h1 class='p-4'>Intermitten Fasting</h1>
                      <h4> Intermittent fasting (IF) is an eating pattern that cycles between periods of fasting and eating. 
                        It doesn't specify which foods you should eat but rather when you should eat them. 
                        In this respect, it's not a diet in the conventional sense but more accurately described as an eating pattern</h4>
                  </div>
                  
                  <div class="col-lg-6 p-5 my-auto">    
                        <div>
                           <img src="https://st1.thehealthsite.com/wp-content/uploads/2019/07/intermittent-diet-plan.jpg?impolicy=Medium_Resize&w=1200&h=800" class="d-block w-100" alt="keto Dieting">
                        </div>            
                  </div>
              </div>                            
            </div>
            
        
            
          <!-----------------------------footer------------------------------------------>
        <footer class="container-fluid bg-dark p-5">
            <div class="row">
                <div class="col-sm-3">
                    <h6 class="text-secondary">Home</h6>
                    <hr>
                    <h6 class="text-secondary">example</h6>
                    <p>
                      
                    </p>
        
                    <h6 class="text-secondary">example</h6>
                    <p>
                        
                    </p>
        
                    <h6 class="text-secondary">example</h6>
                    <p>
                        
                    </p>
                </div>
        
                <div class="col-sm-3">
                    <h6 class="text-secondary">Blank#2</h6>
                    <hr>
                    <h6 class="text-secondary">example</h6>
                    <p>
                      
                    </p>
        
                    <h6 class="text-secondary">example</h6>
                    <p>
                        
                    </p>
        
                    <h6 class="text-secondary">example</h6>
                    <p>
                        
                    </p>
        
                </div>
        
                <div class="col-sm-3">
                    <h6 class="text-secondary">Blank#3</h6>
                    <hr>
        
                    <h6 class="text-secondary">example</h6>
                    <p>
                      
                    </p>
        
                    <h6 class="text-secondary">example</h6>
                    <p>
                        
                    </p>
        
                    <h6 class="text-secondary">example</h6>
                    <p>
                        
                    </p>
                </div>
        
                <div class="col-sm-3" id="contactAnchor">
                    <h6 class="text-secondary">Contact</h6>
                    <hr>
                    <p>
                        <i class="fas fa-envelope"></i> Fitness.com
                    </p>
                    <p>
                        <i class="fas fa-camera"></i> instagram 
                        <br><i class="fab fa-facebook-square"></i> facebook 
                        <br><i class="fab fa-twitter-square"></i> twitter 
                        <br><i class="fab fa-google-plus-square"></i> google+ 
                    </p>
                </div>
        
            </div>
        
            <p class="text-center">Fitness &copy; 2020</p>
        </footer>
          
        <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
        </body>
        
        
        </html>`)
          
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
    res.write(`<!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Bootstrap 4 Website</title>
    
      <!-- JQuery -->
      <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    
      <!-- Bootstrap 4.4.1 -->
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>
    
      <!-- Fontawesome 5.11.2 -->
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.11.2/css/all.css">
    
      <link rel="stylesheet" href="style.css">
    </head>
    <!------------------------------HEAD-------------------------------->
    
    <body>
      <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top">
        <a class="navbar-brand" href="#">
          <img src="./images/body-weighing-scale.jpg" width="30" height="30"
            class="d-inline-block align-top" alt="" loading="lazy">
          fitness
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
    
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
              <a class="nav-link" href="index.html">Home <span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="login.html">Log In</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false">
                Dropdown
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <a class="dropdown-item" href="#">Action</a>
                <a class="dropdown-item" href="#">Another action</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#">Something else here</a>
              </div>
            </li>
            <li class="nav-item">
              <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
            </li>
          </ul>
          <form class="form-inline my-2 my-lg-0">
            <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </form>
        </div>
      </nav>
      <!-- Navigation -->
    
      <!-- START FORM -->
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-12">
            <h1 class="display-2">Register</h1>
            <!-- <form action="/register" method="POST"> -->
              <div>
                <label for="name">Name</label>
                <input type="text" class="form-control" id="name" name="name" required>
    
              </div>
              <div>
                <label>Email address</label>
                <input type="email" class="form-control" id="email" name="email" required>
    
              </div>
              <div>
                <label>Age</label>
                <input type="number" class="form-control" id="age" name="age" required>
              </div>
              <div>
                <label>Height Inches</label>
                <input type="number" class="form-control" id="height" name="height" required>
              </div>
              <div>
                <label>Weight Lbs</label>
                <input type="number" class="form-control" id="weight" name="weight" required>
              </div>
              <div>
                <label>Gender</label>
                <input type="Text" class="form-control" id="gender" name="gender" required>
              </div>
              <div>
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password" name="password" required>
              </div>
    
              <!-- register button -->
              <button id = 'registerButton' type="submit" class="btn btn-primary">Register</button>
    
            <!-- </form> -->
          </div>
    
    
        </div>
      </div>
    
      <!-----------------------------footer------------------------------------------>
      <footer class="container-fluid bg-dark p-5">
        <div class="row">
          <div class="col-sm-3">
            <h6 class="text-secondary">Home</h6>
            <hr>
            <h6 class="text-secondary">example</h6>
            <p>
    
            </p>
    
            <h6 class="text-secondary">example</h6>
            <p>
    
            </p>
    
            <h6 class="text-secondary">example</h6>
            <p>
    
            </p>
          </div>
    
          <div class="col-sm-3">
            <h6 class="text-secondary">Blank#2</h6>
            <hr>
            <h6 class="text-secondary">example</h6>
            <p>
    
            </p>
    
            <h6 class="text-secondary">example</h6>
            <p>
    
            </p>
    
            <h6 class="text-secondary">example</h6>
            <p>
    
            </p>
    
          </div>
    
          <div class="col-sm-3">
            <h6 class="text-secondary">Blank#3</h6>
            <hr>
    
            <h6 class="text-secondary">example</h6>
            <p>
    
            </p>
    
            <h6 class="text-secondary">example</h6>
            <p>
    
            </p>
    
            <h6 class="text-secondary">example</h6>
            <p>
    
            </p>
          </div>
    
          <div class="col-sm-3" id="contactAnchor">
            <h6 class="text-secondary">Contact</h6>
            <hr>
            <p>
              <i class="fas fa-envelope"></i> Fitness.com
            </p>
            <p>
              <i class="fas fa-camera"></i> instagram
              <br><i class="fab fa-facebook-square"></i> facebook
              <br><i class="fab fa-twitter-square"></i> twitter
              <br><i class="fab fa-google-plus-square"></i> google+
            </p>
          </div>
    
        </div>
    
        <p class="text-center">Fitness &copy; 2020</p>
      </footer>
      <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
      <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
        integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj"
        crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"
        integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN"
        crossorigin="anonymous"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"
        integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV"
        crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    
        <script src = "register.js"></script>
    </body>
    
    </html>`)
  });
  
  //REGISTER YOUR INFO TO OUR WEBSITE / DATABASE ROUTE
  app.post('/register', redirectHome, function (req, res) {
  
    if( req.body.name && req.body.password && req.body.email) {
  
    //   if (req.body.email == db.query(`SELECT * FROM users WHERE email = '${req.body.email}'`)){
    //     alert('this username is already taken')
    //   }
      let encryptedPass = encryptPassword(req.body.password);
      db.query(`INSERT INTO users (name, email, password) 
      VALUES ('${req.body.name}', '${req.body.email}','${encryptedPass}')`)
      .then(function (response) {
        console.log(response);
        console.log('JUST SUBMITTED REQUEST')
        
        res.write(`<!doctype html>
        <html lang="en">
        
        <head>
            <!-- Required meta tags -->
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        
            <!-- Bootstrap CSS -->
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
                integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
        
            <title>Nutrition Tracker</title>
        </head>
        
        <body>
            <!-- START NAV -->
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <a class="navbar-brand" href="#">Navbar</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
        
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item active">
                            <a class="nav-link" href="index.html">Home <span class="sr-only">(current)</span></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="register.html">Register</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Dropdown
                            </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a class="dropdown-item" href="#">Action</a>
                                <a class="dropdown-item" href="#">Another action</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="#">Something else here</a>
                            </div>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
                        </li>
                    </ul>
                    <form class="form-inline my-2 my-lg-0">
                        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
                        <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                    </form>
                </div>
            </nav>
            <!-- END NAV -->
        
        
            <!-- START FORM -->
            <div class="container">
                <div class="row">
                    <h1 class="display-2">Login</h1>
                    <form action="/login" method="POST">
                        <div class="form-group">
                            <label for="email">Email address</label>
                            <input type="email" class="form-control" id="email">
                            <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone
                                else.</small>
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Password</label>
                            <input type="password" class="form-control" id="exampleInputPassword1">
                        </div>
                        <button type="submit" class="btn btn-primary">Login</button>
                        <a href="/register">Register</a>
                    </form>
        
                </div>
            </div>
        
            <!-- Optional JavaScript -->
            <!-- jQuery first, then Popper.js, then Bootstrap JS -->
            <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
                integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj"
                crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"
                integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN"
                crossorigin="anonymous"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"
                integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV"
                crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
        
        </body>
        
        </html>`)
  
      }).catch(function (error){
        console.log(error);
        // res.send('error');
      })
  
    } else {
      res.send('Please send a username and password');
    }
  });
  
// -------------- BRYAN'S CODE END ------------------------------

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


app.listen(PORT, function () {
    console.log(`My API is listening on port ${PORT}.... `);
});