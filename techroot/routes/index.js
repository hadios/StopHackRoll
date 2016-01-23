var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');

var Account     = require('../models/account');
var ProjectInfo = require('../models/projectinfo');
var Product     = require('../models/product');

var router = express.Router();

/*
// Landing page
*/
router.get('/', function(req, res, next) {
  res.render('landing-page', {
    user: req.user
  });
});


/*
// Register
*/
router.get('/register', function(req, res) {
  res.render('register-page', {});
});

router.post('/register', function(req, res) {
  Account.register(new Account({
    username: req.body.username
  }), req.body.password, function(err, account) {
    if (err) {
      console.log("Encountered error registering! Error: " + err);
      return res.render('register-page', {
        account: account
      });
    }

    passport.authenticate('local')(req, res, function() {
      res.redirect('/');
    });
  });
});


/*
// Login and logout
*/
router.get('/login', function(req, res) {
  res.render('login-page', {
    user: req.user
  });
});

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/error'
}), function(req, res) {
  res.redirect('/');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


/*
// Project
*/
router.get('/projectHome', function(req, res) {
  ProjectInfo.find({}, function(err, foundProjects) {
    if (err) {
      res.render('project-home', {
        user: req.user,

      });
      return;
    }

    res.render('project-home', {
      user: req.user,
      projects: foundProjects
    });
  });
});

router.get('/projectDetail/:id', function(req, res) {
  var id = req.params['id'];
  console.log("Project ID: " + req.params['id']);

  ProjectInfo.findById(id, function(err, foundProject){
    if (err) {
      console.log("Unable to find project! Error: " + err);
      res.render('project-home', {
        user: req.user
      });
      return;
    } else if (foundProject == null) {
      console.log("No such project found!");
      res.render('project-home', {
        user: req.user
      });
      return;
    }
    console.log("Project found!");

    // Randomise the related project page
    var random = Math.floor(Math.random() * 5);

    ProjectInfo.find({}).skip(random).limit(5).exec(function(err, relatedProjects){
      if (err) {
        console.log("Unable to find related projects!");
        res.render('project-home', {
          user: req.user
        });
        return;
      }

      res.render('project-detail', {
        user: req.user,
        project: foundProject,
        relatedProjects: relatedProjects
      });
    });
  });
});


/*
// Market
*/
router.get('/marketHome', function(req, res) {
  console.log("FOUND!");

  Product.find({}, function(err, foundProducts) {
    if (err) {
      console.log("Encountered error finding product. Error: " + err);
      res.render('market-home', {
        user: req.user,
      });
      return;
    }

    res.render('market-home', {
      user: req.user,
      products: foundProducts
    });
  });
});


/*
// Debugging
*/
router.get('/ping', function(req, res) {
  res.status(200).send("pong!");
});

router.get('/debug', function(req, res) {
  Account.find({}, function(err, foundAccounts) {
    ProjectInfo.find({}, function(err, foundProjectInfo) {
      Product.find({}, function(err, foundProduct){
        res.render('debug.ejs', {
          accounts: foundAccounts,
          projects: foundProjectInfo,
          products: foundProduct
        });
      });
    });
  });
});

router.get('/deleteAll', function(req, res) {
  Account.remove({}, function(err) {
    res.redirect('/debug');
  });
});

router.get('/deleteAllProjects', function(req, res) {
  ProjectInfo.remove({}, function(err) {
    res.redirect('/debug');
  });
});

router.get('/deleteAllProducts', function(req, res) {
  Product.remove({}, function(err) {
    res.redirect('/debug');
  });
});

module.exports = router;
