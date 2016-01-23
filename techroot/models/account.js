var mongoose              = require('mongoose');
var Schema                = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

// create a schema
var accountSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String }
});

accountSchema.plugin(passportLocalMongoose);

// the schema is useless so far
// we need to create a model using it
var Account = mongoose.model('Account', accountSchema);

// make this available to our users in our Node applications
module.exports = Account;
