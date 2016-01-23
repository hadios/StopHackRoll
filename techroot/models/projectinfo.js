var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var projectInfoSchema = new Schema({
  projectName: String,
  targetFunds: Number,
  currentFunds: { type: Number, default: 0 },
  numberOfBackers: { type: Number, default: 0 },
  timeleft: Number,
  description: String,
  details: String,
  perkName: String,
  perkCost: Number,
  perkDescription: String
});

var ProjectInfo = mongoose.model('ProjectInfo', projectInfoSchema);

module.exports = ProjectInfo;
