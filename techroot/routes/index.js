var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');

var Account = require('../models/account');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.ejs', {
    title: 'Express'
  });
});

router.get('/register', function(req, res) {
  res.render('register.ejs', {});
});

router.post('/register', function(req, res) {
  console.log("Body:");
  console.log(req.body);

  Account.register(new Account({
    username: req.body.username
  }), req.body.password, function(err, account) {
    if (err) {
      console.log("Encountered error registering! Error: " + err);
      return res.render('register', {
        account: account
      });
    }

    console.log("Someone registered!");
    console.log(account);

    passport.authenticate('local')(req, res, function() {
      res.redirect('/');
    });
  });
});

router.get('/login', function(req, res) {
  res.render('login.ejs', {
    user: req.user
  });
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), function(req, res) {
  res.redirect('/');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/ping', function(req, res) {
  res.status(200).send("pong!");
});

router.get('/debug', function(req, res) {
  Account.find({}, function(err, foundAccounts){
    res.render('debug.ejs', {
      accounts: foundAccounts
    });
  });
});

router.get('/deleteAll', function(req, res) {
  Account.remove({}, function(err) {
    res.render('debug.ejs', {
      accounts: null
    });
  });
});

module.exports = router;
