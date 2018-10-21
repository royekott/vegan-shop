var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 

var schema = new Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    imagePath: { type: String, required: true }
});


module.exports = mongoose.model('Product', schema);