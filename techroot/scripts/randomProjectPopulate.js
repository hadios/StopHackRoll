// This script will randomly populate the projects

/*
 / Main script
*/

var mongoose = require('mongoose');
var csvparse = require('csv-parse');
var async    = require('async');

var ProjectInfo = require('../models/projectinfo');

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

  async.eachSeries(result, function(item, callback) {
    // var targetFunds   = Math.floor((Math.random() * 10000) + 1000);
    // var currentFunds  = Math.floor((Math.random() * targetFunds) + 10);
    // var daysLeft      = Math.floor((Math.random() * 100) + 1);
    // var backers       = Math.floor((Math.random() * 100) + 1);

    var currentProject = new ProjectInfo({
      projectName: item.projectName,
      targetFunds: item.targetFunds,
      currentFunds: item.currentFunds,
      numberOfBackers: item.numberOfBackers,
      timeleft: item.timeleft,
      description: item.description,
      details: item.details
    });

    currentProject.save(function(err, savedProject) {
      if (err) {
        console.log("Error saving project! Error: " + err);
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
