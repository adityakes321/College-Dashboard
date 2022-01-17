const express=require('express');
const router = express.Router();
const passport = require('passport');
const gender=['Male','Female','others']
const branch=['CSE','IT','BioTech','Electrical'];
const course=['Btech','BBA','MBA'];

const Student=require('../models/student')

const {isLoggedIn}= require('../middleware');

router.get('/',isLoggedIn,async(req,res)=>{
    const students= await Student.find({});
    res.render('students/index',{students})
})

router.get('/new',(req,res)=>{
    res.render('students/new',{gender,course,branch})
})
// All the other stuff

router.get('/registerStudent',(req,res)=>{
    res.render('Student2/register',{gender,course,branch});
})

router.post('/register',async(req,res)=>{
    try{
        const {username,password,id,name,city,state,joinyear,endyear,cg,gender,course,branch}=req.body;
        const newstu=new Student({username,id,name,city,state,joinyear,endyear,cg,gender,course,branch});
        const registeredStudent= await Student.register(newstu,password);
        console.log(registeredStudent);
        res.render('partials/studentsportal')
    }catch(e){
        req.flash('error',e.message);
    }
})

router.get('/login',(req,res)=>{
    res.render('Student2/login');
})

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/students/login'}),(req,res)=>{
    req.flash('success','welcome back!')
    const loggeduser=req.user;
    // const redirectUrl= req.session.returnTo || '/campgrounds';
    // delete req.session.returnTo
    res.render('partials/studentsportal',{loggeduser});

    
})
router.get('/logout',(req,res)=>{
    req.flash('success',"GoodBye!!")
    req.logout();
    res.render('student2/login');
})

//other stuff ends


router.post('/',isLoggedIn,async(req,res)=>{
    const student=new Student(req.body.student);
    await student.save();
    req.flash('success','Successfully Added a new Student')
    // console.log(student);
    res.redirect(`/students/${student._id}`)
})

router.get('/:id',async(req,res)=>{
    const student =await Student.findById(req.params.id);
    res.render('students/show',{student});
})

router.get('/:id/edit',isLoggedIn,async(req,res)=>{
    const {id}=req.params;
    const student =  await Student.findById(id)
    res.render('students/edit',{student,course,branch})
})

router.put('/:id',async(req,res)=>{
    const {id}=req.params;
    const student= await Student.findByIdAndUpdate(id,req.body,{runValidators:true,new:true});
    req.flash('success','Successfully updated the student data')
    res.redirect(`/students/${student._id}`);
})

router.delete('/:id',isLoggedIn,async(req,res)=>{
    const {id}=req.params;
    const DeletedStudent= await Student.findByIdAndDelete(id)
    res.redirect('/students');
})



module.exports= router;