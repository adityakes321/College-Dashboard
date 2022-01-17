const express= require('express');
const router= express.Router();
const gender=['Male','Female','others']
const branch=['CSE','IT','BioTech','Electrical'];
const course=['Btech','BBA','MBA'];

const Teacher=require('../models/teacher')
const Student=require('../models/student')

const {isLoggedIn}= require('../middleware');

router.get('/',async(req,res)=>{
    const teachers=await Teacher.find({});
    // console.log(teachers)
    res.render('teachers/index',{teachers})
})

router.get('/new',(req,res)=>{
    res.render('teachers/new')
})

router.post('/',isLoggedIn,async(req,res)=>{
    const teacher=new Teacher(req.body);
    await teacher.save();
    req.flash('success','Successfully Added a Teacher')
    res.redirect('/teachers');
})

router.get('/:id',isLoggedIn,async(req,res)=>{
    const teacher = await Teacher.findById(req.params.id).populate('students')
    console.log(teacher);
    res.render('teachers/show',{teacher}) 
})

router.delete('/:id',isLoggedIn,async(req,res)=>{
    console.log("deleting");
    await Teacher.findByIdAndDelete(req.params.id);
    res.redirect('/teachers')
})

router.get('/:id/students/new',async(req,res)=>{
    const {id}=req.params;
    const teacher= await Teacher.findById(id);
    
    res.render('students/new',{teacher,gender,course,branch})
})


router.post('/:id/students',async(req,res)=>{
    const {id}=req.params;
    const teacher=await Teacher.findById(id);
    const student=new Student(req.body.student);
    
    teacher.students.push(student);
    await teacher.save();
    await student.save();
    req.flash('success',"Successfully Added a Student")
    res.redirect(`/teachers/${id}`)

})

module.exports=router;
