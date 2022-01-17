const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const teacherSchema = new Schema({
    name:String,
    subject:String,
    batch:String,
    password:String,
    students:[
        {
            type:Schema.Types.ObjectId,
            ref:'Student'
        }
    ]
});
module.exports = mongoose.model('Teacher',teacherSchema);
