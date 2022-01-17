const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const newStudentsSchema=new Schema({
    name:String,
    subject:String,
    marks:Number,
    year:Number,
    fees:Number,
    attendance:Number,
    cg:Number

});
const Newstudent=mongoose.model('Newstudent',newStudentsSchema);
module.exports=Newstudent;