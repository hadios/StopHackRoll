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
var FILE_TO_READ = "./productlist.csv";

var Converter = require("csvtojson").Converter;
var converter = new Converter({});
converter.fromFile(FILE_TO_READ,function(err,result){
  console.log("Result: ");
  console.log(result);

  async.eachSeries(result, function(item, callback) {
    var currentProduct = new Product({
      name: item.name,
      description: item.description,
      details: item.details,
      price: item.price,
      rating: item.rating,
      numberOfReviews: item.numberOfReviews,
      category: item.category,
      imageName: item.imageName
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
});
