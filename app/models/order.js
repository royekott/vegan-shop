var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var schema = new Schema({
    userID: {type: String, required: true},
    cart: {type: Object, required: true},
    city: {type: String, required: true},
    street: {type: String, required: true},
    shipping_date: {type: String, required: true},
    credit_card: {type: String, required: true},
    cc_date: {type: String, required: true},
    cc_cvv: {type: String, required: true}
});

module.exports = mongoose.model('Order', schema);