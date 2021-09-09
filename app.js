const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const User = require('./models/user');
const secrets = require('./secrets');

//Passport auth

passport.use('sign-in', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    session: false
  },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email });
      if (typeof user == undefined) {
        return done(null, false, { message: 'Email not found' });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (err) return done(err);
        if (res) return done(null, user); // passwords match - log user in
        else return done(null, false, { message: "Incorrect password" }) // passwords do not match
      });
    } catch (err) {
      return done(err);
    }
  })
);
passport.use(
  new JWTstrategy(
    {
      secretOrKey: secrets.jwtSecret,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => { //TODO try removing async
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
passport.use('sign-up', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true
  },
  async (req, email, password, done) => { //TODO try removing async
    try {
      User.findOne({ email: email }, (err, user) => {
        if (err) { 
          return done(err); 
        }
        if (!user) {
          bcrypt.hash(password, 10, async (err, hashedPassword) => {
            if (err) { return done(err); }
            else {
              const user = await User.create(
                {
                  email: email,
                  password: hashedPassword,
                  first_name: req.body.first_name,
                  last_name: req.body.last_name,
                  admin: req.body.admin
                }
              );
              return done(null, user);
            }
          });
        } else {
          return done(null, false, { message: 'Email is already in use' });
        }
      });
    }
    catch (err) {
      done(err);
    }

  })
);

// Import routes
const router = require('./routes/routes.js');

// Establish database connection
const mongoDb = `mongodb+srv://user_01:${secrets.mongoPassword}@cluster0.pdr27.mongodb.net/database_01?retryWrites=true&w=majority`
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

// Define app
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// check routes
app.use('/', router); //TODO should split into /api for api and / for index

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
