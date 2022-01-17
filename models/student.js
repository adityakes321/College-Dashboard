const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');
const passport= require('passport');

const studentSchema= new Schema({
    id:{
        type:Number
    },
    name:{
        type:String,
        required:[true,'Name required!']
    },
    city:{
        type:String
    },
    state:String,
    joinyear:Number,
    endyear:Number,
    cg:Number,
    gender:{
        type:String,
        // enum:['Male','Female','others']
    },
    course:{
        type:String,
        enum:['Btech','BBA','MBA']
    },
    branch:{
        type:String,
        enum:['CSE','IT','BioTech','Electrical']
    },
    teacher:{
        type:Schema.Types.ObjectId,
        ref:'Teacher'
    }

})
studentSchema.plugin(passportLocalMongoose);
const Student=mongoose.model('Student',studentSchema);


module.exports=Student;