const express=require('express');
const passport = require('passport');
const router = express.Router();
const Admin=require('../models/admin');
const catchAsync=require('../utils/catchAsync')

router.get('/registerAdmin',(req,res)=>{
    res.render('Admin2/register');
})

router.post('/register',catchAsync(async(req,res)=>{
    try{
        const {username,password}=req.body;
        const admin= new Admin({username});
        const registeredAdmin= await Admin.register(admin,password);
        res.render('partials/AdminNavbar');

        req.login(registeredUser,err=>{
            if(err) return next(err);
            req.flash('success','Welcome Back!');
            res.render('partials/adminNav');
        })

    }catch(e){
        req.flash('error',e.message);
        res.render('partials/adminNav');
    }
    
}))

router.get('/login',(req,res)=>{
    res.render('Admin2/login');
})

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    req.flash('success','welcome back!')
    const redirectUrl= req.session.returnTo || 'partails/adminNav';
    delete req.session.returnTo
    res.render('partials/adminNav');

})
router.get('/logout',(req,res)=>{
    req.flash('success',"Goodbye!!")
    req.logout();
    res.redirect('/login');
})

module.exports= router;