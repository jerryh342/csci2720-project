const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
// const MongoStore = require('connect-mongo');

const LoginModel = require('./models/login')

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000", // <-- location of the react app were connecting to
    credentials: true,
  })
);
app.use(
  session({
    secret: "secretcode",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);


const Schema = mongoose.Schema;
mongoose.connect('mongodb://127.0.0.1:27017/project'); // put your own database link here

const db = mongoose.connection;
// Upon connection failure
db.on('error', console.error.bind(console, 'Connection error:'));
// Upon opening the database successfully
db.once('open', function () {
    console.log("Connection is open... success");

    
    app.get('/home', checkAuth, (req, res)=>{
        res.send("Authenticated")
    })

    app.get('/login', (req, res)=>{
        res.status(403).send("login")
    })

    app.post("/login", (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
        console.log("running")
        console.log("user", user)
          if (err) throw err;
          if (!user) res.send("Password or Username dont match");
          else {
            req.logIn(user, (err) => {
              if (err) throw err;
              res.status(200).send("Successfully Authenticated");
              console.log(req.user);
            });
          }
        })(req, res, next);
      });

    app.post('/register', async (req, res) => {
        try {
            const { values } = req.body
            console.log("values>>", values)
            const username = values.username ? values.username : ''
            const email = values.email ? values.email : ''
            const password = values.password ? await bcrypt.hash(values.password, 10) : ''
            console.log("username>> ", username)
            console.log("email>> ", email)
            console.log("password>> ", password)

            if (!username || !email || !password) {
                return res.status(406).send("Field missing")
            }

            LoginModel.create({
                username: username,
                email: email,
                password: password
            })
                .then(user => res.json(user))
                .catch(err => res.json(err))



        } catch (error) {

        }
    })

    app.delete('/logout', (req, res, next) => {
        req.logout(function(err) {
            if (err) { 
                return next(err); 
            }
            res.redirect('/login');
        });
    });
    
    app.get('/checkAuth', (req, res)=>{
        res.set('Content-Type', 'application/json');
        console.log("checking>>>")
        if (req.isAuthenticated()){
            console.log("checkAuth")
            return res.status(200).send(req.user)
        }
        return res.status(403).send("Not Auth")
    })

    function checkAuth (req, res, next) {
        console.log("req.user>", req.user)
        console.log("req.isAuthenticated())>>", req.isAuthenticated())
        if (req.isAuthenticated()){
            console.log("req.isAuthenticated>>", req.isAuthenticated)
            return next()
        }
        console.log("redirectted")
        res.redirect('/login')
    }

})

app.listen(3001, () => console.log("listening on port 3001"))