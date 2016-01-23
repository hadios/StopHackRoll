var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var productSchema = new Schema({
  name: String,
  description: String,
  details: String,
  price: Number,
  rating: { type: Number, default: 0 },
  numberOfReviews: { type: Number, default: 0 },
  category: ""
});

var Product = mongoose.model('Product', productSchema);

module.exports = Product;
