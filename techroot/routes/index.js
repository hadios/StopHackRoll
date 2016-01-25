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

    // Loop through the user projects to see if there is user fund this project
    var fundingAmount = 0;
    console.log(req.user);
    if (req.user) {
      var projectSupport = req.user.projectSupport;
      for (var i = 0; i < projectSupport.length; i++) {
        if (String(projectSupport[i].projectId) === String(id)) {
          fundingAmount = projectSupport[i].amount;
          break;
        }
      }
    }

    // Randomise the related project page
    var random = Math.floor(Math.random() * 5);

    ProjectInfo.find({}).skip(random).limit(5).exec(function(err, relatedProjects){
      if (err) {
        console.log("Unable to find related projects!");
        res.render('project-detail', {
          user: req.user,
          project: foundProject,
          relatedProjects: relatedProjects,
          fundingAmount: fundingAmount
        });
        return;
      }

      console.log("Pass!");

      res.render('project-detail', {
        user: req.user,
        project: foundProject,
        relatedProjects: relatedProjects,
        fundingAmount: fundingAmount
      });
    });
  });
});

router.post('/fundProject/:id', function(req, res) {
  var id = req.params['id'];
  console.log("Project ID: " + req.params['id']);

  console.log("Body: ");
  console.log(req.body);
  console.log(req.user);

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

    foundProject.currentFunds += parseInt(req.body.amount);
    foundProject.save(function(err, savedProject) {

      Account.findById(req.user._id, function(err, foundAccount){
        if (err) {
          console.log("Unable to find user! Error: " + err);
        } else {
          var found = false;
          for (var i = 0; i < foundAccount.projectSupport.length; i++) {
            if (String(foundAccount.projectSupport[i].projectId) === String(savedProject._id)) {
              foundAccount.projectSupport[i].amount += parseInt(req.body.amount);
              found = true;
              break;
            }
          }

          if (!found) {
            foundAccount.projectSupport.push({
              projectId: savedProject._id,
              amount: parseInt(req.body.amount)
            });
          }

          foundAccount.save(function(err, savedAccount) {
            if (err) {
              console.log("Unable to save account! Error: " + err);
            }

            res.redirect('/projectDetail/' + savedProject._id);
          });
        }
      });
    })
  });
});

router.get('/projectCreation', function(req, res) {
    res.render('project-creation', {
      user: req.user
    });
});

router.post('/projectCreation', function(req, res) {
    console.log("Body: ");
    console.log(req.body);

    var newProject = new ProjectInfo({
      projectName: req.body.projectName,
      targetFunds: req.body.targetFunds,
      timeleft: req.body.timeleft,
      description: req.body.description,
      details: req.body.details
    });

    newProject.save(function(err) {
      if (err) {
        res.render('project-creation', {
          user: req.user
        });
        return;
      }

      console.log("Redirecting!");

      res.redirect('/projectDetail/' + newProject._id);
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

router.get('/marketDetail/:id', function(req, res) {
  var id = req.params['id'];
  console.log("Project ID: " + req.params['id']);

  Product.findById(id, function(err, foundProduct){
    if (err) {
      console.log("Unable to find product! Error: " + err);
      res.render('market-home', {
        user: req.user
      });
      return;
    } else if (foundProduct == null) {
      console.log("No such product found!");
      res.render('market-home', {
        user: req.user
      });
      return;
    }

    // Randomise the related project page
    var random = Math.floor(Math.random() * 5);

    Product.find({}).skip(random).limit(5).exec(function(err, relatedProducts){
      if (err) {
        console.log("Unable to find related projects!");
        res.render('market-detail', {
          user: req.user,
          product: foundProduct,
          relatedProducts: relatedProducts
        });
        return;
      }

      console.log("Pass!");

      res.render('market-detail', {
        user: req.user,
        product: foundProduct,
        relatedProducts: relatedProducts
      });
    });
  });
});

router.get('/productCreation', function(req, res) {
  res.render('product-creation', {
    user: req.user
  });
});

router.post('/productCreation', function(req, res) {
    console.log("Body: ");
    console.log(req.body);

    var newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      details: req.body.details,
      price: req.body.price,
      rating: req.body.rating,
      numberOfReviews: req.body.numberOfReviews,
      category: ""
    });

    newProduct.save(function(err) {
      if (err) {
        res.render('product-creation', {
          user: req.user
        });
        return;
      }

      res.redirect('/marketDetail/' + newProduct._id);
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
