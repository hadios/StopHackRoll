var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var projectInfoSchema = new Schema({
  projectName: String,
  targetFunds: Number,
  currentFunds: { type: Number, default: 0 },
  numberOfLikes: { type: Number, default: 0 },
  descriptioon: String,
});

var ProjectInfo = mongoose.model('ProjectInfo', projectInfoSchema);

module.exports = ProjectInfo;
