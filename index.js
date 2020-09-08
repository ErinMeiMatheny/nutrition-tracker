const express = require('express');
const app = express();
const promise = require('bluebird');
var bodyParser = require('body-parser')
//const bcrypt = require('bcrypt');

const sequelizeDB = require("./models");

//Used for adding extra security
//const saltRounds = 10;

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
    user: 'ernestocarrilloguerrero'
};

// Load and initialize pg-promise:
const pgp = require('pg-promise')(initOptions);

// Create the database instance:
const db = pgp(config);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(__dirname + '/web'));

let timestamp = new Date().toLocaleDateString()