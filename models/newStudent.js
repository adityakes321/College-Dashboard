const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const newStudentSchema=new Schema({
    name:String,
    subject:String,
    marks:Number,
    year:Number,
    fees:Number,
    attendance:Number,
    cg:Number

});
const Nstudent=mongoose.model('Nstudent',newStudentSchema);
module.exports=Nstudent;