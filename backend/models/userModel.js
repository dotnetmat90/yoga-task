const mongoose  = require('mongoose');

const userModel = mongoose.Schema({
    firstname:{type:String},
    lastname:{type:String},
    email:{type:String},
    password:{type:String},
    subscriptionType: {type: String},
    subscriptionStart: {type: Date},
    subscriptionEnd: {type: Date},
    type:{type:String}
},  
 { timestamps: true }
);
const User =  mongoose.model('User',userModel);
module.exports = User;