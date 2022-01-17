const mongoose = require('mongoose')

const ClockingSchema = new mongoose.Schema({
  clockIn: {
    type: Date,
    default: Date.now,
  },
  clockOut: {
    type: Date,
    default: Date.now,
  },
  student:{
    type:Number,
    ref: 'Student'
  }
});

module.exports = mongoose.model('Clocking', ClockingSchema)