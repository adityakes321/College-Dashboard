const mongoose= require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const passport= require('passport');

const adminSchema= new Schema({
    year:Number,
    fees:Number,
    hubname:String,
    totalSpentOnHub:Number,
    avgcg:Number,
    company:String,
    offer:Number,
    placed:Number
});
adminSchema.plugin(passportLocalMongoose);
const Admin=mongoose.model('Admin',adminSchema);
module.exports=Admin;