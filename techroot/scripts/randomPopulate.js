// This script will randomly populate the projects

/*
 / Main script
*/

var mongoose  = require('mongoose');
var csvparse  = require('csv-parse');


// Connect to mongodb
mongoose.connect('mongodb://localhost/techroot');


// GLOBAL variables
var FILE_TO_READ = "projectlist.csv";


// Read from file

// Add in projects one by one
