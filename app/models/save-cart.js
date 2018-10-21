var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 

var Schema = new Schema({
    userID: {type: String, required: true},
    products: {type: Object, require: true},
    totalQty: {type: Number, required: true},
    totalPrice: {type: Number, required: true}
});

module.exports = mongoose.model('Save-cart', Schema); 