const express = require('express')
const app = express ();
portNumber = 3000;

//this is the view engine

app.set('view engine', 'ejs')

//return main page
app.get("/", (req,res) => {
    res.render("index.ejs")
})

//GET login
app.get("/login", (req, res) => {
    res.render("login.ejs")
})

//POST login
app.post("/login", (req, res) => {
    res.render("login.ejs")
})

//GET register
app.get("/register", (req, res) => {
    res.render("register.ejs")
})

//POST register
app.post("/register", (req, res) => {
    res.render("register.ejs")
})


app.listen(portNumber, function () {
    console.log(`My API is listening on port ${portNumber}.... `);
});