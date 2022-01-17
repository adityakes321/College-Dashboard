const express = require("express");
const router = express.Router();

const Clocking=require('../models/Clocking');
const Student=require('../models/student');

router.get('/attendance',(req,res)=>{
    res.render('attendance/dashboard')
})

router.get('/clockings',async(req,res)=>{
    try{
        const clockings= await Clocking.find({}).populate('student').lean();
        console.log(clockings);
        res.render('attendance/clocking',{clockings});

    }catch(err){
        console.log(err);
    }
})

router.post('/clocking',async(req,res)=>{
    const value= req.body.clock;
    const id=req.body.empId;

    try{
        const students= await Student.find({id:id});
        console.log(students);
        const data = await Clocking.find({student:id}).populate('student').lean();
        console.log(data);

        if(students.length!=[]){
            if(value =='in'){
                req.flash("success",`You clock In ${time_string}`);
                const i =data.length;
                if(data.length !=[]){
                    const clockIn = getTimeStringpara(data[i - 1].clockIn);
                    const clockOut = getTimeStringpara(data[i - 1].clockOut);
                    console.log(clockIn);
                    console.log(clockOut);
                    if(clockIn===clockOut){
                        req.flash("error","You haven't clock Out,Please Clock Out");
                        res.redirect('/attendance');

                    }else{
                        const time_string=getTimeString();
                        await Clocking.create({student:id});
                        req.flash("success",`You clock In ${time_string}`);
                        res.redirect('/attendance');
                    }
                }else{
                    const time_string=getTimeString();
                        await Clocking.create({student:id});
                        req.flash("success",`You clock In ${time_string}`);
                        res.redirect('/attendance');
                }
            }
            if(value =="out"){
                const i= data.length;
                if(data.length!=0){
                    const clockIn = getTimeStringpara(data[i - 1].clockIn);
                    const clockOut = getTimeStringpara(data[i - 1].clockOut);
                    if(clockIn == clockOut){
                        const id= data[i-1].id;
                        const date= new Date();
                        const time_string =getTimeString();
                        await Clocking.findOneAndUpdate({id:id},{clockOut:date});
                        req.flash('msg_in',`You mark out ${time_string}`);
                        res.redirect('/attendance');
                    }else{
                        req.flash('msg_out',"You haven't clock In");
                        res.redirect('/attendance');
                    }
                }else{
                    req.flash("msg_out","You haven't clock IN");
                    res.redirect('/attendance');
                }
            }
        }else{
            req.flash('msg_out',"Invalid Student Id");
            res.redirect('/attendance')
        }
    }
    catch(err){
        console.log(err);
    }
})




function getTimeString() {
    const date = new Date();
    const h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    let d = date.getDate();
    let mo = date.getMonth() + 1;
    console.log(d);
    console.log(mo);
    const y = date.getFullYear();
    m = checkTime(m);
    s = checkTime(s);
    d = checkTime(d);
    mo = checkTime(mo);
    const time_string = `on ${d}/${mo}/${y}, at ${h}:${m}:${s}`;
    return time_string;
  }
  
  function getTimeStringpara(date) {
    const h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    let d = date.getDate();
    let mo = date.getMonth() + 1;
    console.log(d);
    console.log(mo);
    const y = date.getFullYear();
    m = checkTime(m);
    s = checkTime(s);
    d = checkTime(d);
    mo = checkTime(mo);
    const time_string = `on ${d}/${mo}/${y}, at ${h}:${m}:${s}`;
    return time_string;
  }
  
  function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    } // add zero in front of numbers < 10
    return i;
  }

module.exports = router;