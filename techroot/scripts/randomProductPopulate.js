// This script will randomly populate the projects

/*
 / Main script
*/

var mongoose = require('mongoose');
var csvparse = require('csv-parse');
var async    = require('async');

var Product = require('../models/product');

// Connect to mongodb
mongoose.connect('mongodb://localhost/techroot');


// GLOBAL variables
var FILE_TO_READ = "projectlist.csv";

// Add in projects one by one

var tempArray = [];
for (var i = 0; i < 10; i++) {
  tempArray.push(i);
}

var Converter = require("csvtojson").Converter;
var converter = new Converter({});
converter.fromFile("./projectlist.csv",function(err,result){
  console.log("Result: ");
  console.log(result);
});

async.eachSeries(tempArray, function(item, callback) {
  var price   = Math.floor((Math.random() * 100) + 1) + 0.99;
  var rating  = Math.floor((Math.random() * 2) + 3);
  var reviews = Math.floor((Math.random() * 50) + 1);

  var currentProduct = new Product({
    name: "Product test",
    description: "Description",
    price: price,
    rating: rating,
    numberOfReviews: reviews,
  });

  currentProduct.save(function(err, savedProduct) {
    if (err) {
      console.log("Error saving product! Error: " + err);
    }

    return callback();
  });
}, function(err) {
  if (err) {
    console.log('A file failed to process');
  } else {
    console.log('All files have been processed successfully');
  }
  return;
});
