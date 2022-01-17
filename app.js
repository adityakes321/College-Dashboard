const express=require('express');

const path=require('path');
const mongoose= require('mongoose');
const { urlencoded } = require('express');
const ejsMate= require('ejs-mate')
const methodOverride= require('method-override');

const Student=require('./models/student');
const Admin=require('./models/admin');
const Teacher = require('./models/teacher');
const Nstudent = require('./models/newStudent');
const Newstudent=require('./models/newStudent2');

const gender=['Male','Female','others']
const branch=['CSE','IT','BioTech','Electrical'];
const course=['Btech','BBA','MBA'];

const session = require('express-session');
const flash = require('connect-flash');
const { nextTick } = require('process');

const admins=require('./routes/admins')
const teachers= require('./routes/teachers');
const students= require('./routes/students');

const passport=require('passport');
const LocalStrategy = require('passport-local');

mongoose.connect('mongodb://localhost:27017/MinorProjectFinal')
.then(()=>{
    console.log("Mongo Connection open!");
})
.catch(err=>{
    console.log("Oh no Mongo Connection error");
    console.log(err);
})

// const DB='mongodb+srv://adityagrover7:adityag07@cluster0.zht3z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
// mongoose.connect(DB)
// .then(()=>{
//     console.log("connection done")
// })
// .catch(err =>{
//     console.log("error in connection");
// })

const db =mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"))
db.once("open",()=>{
    console.log("Databse Connected");
});



const app =express();
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}))

app.use(methodOverride('_method'))

app.use(express.static(path.join(__dirname,'public')))


const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Admin.authenticate()))

passport.serializeUser(Admin.serializeUser())//to login session
passport.deserializeUser(Admin.deserializeUser())


//for student login
passport.use(new LocalStrategy(Student.authenticate()))

passport.serializeUser(Student.serializeUser())
 passport.deserializeUser(Student.deserializeUser())

//end for student login

// teachers routes
app.get('/addteacher',async(req,res)=>{
    const teacher = new Teacher({name:'Alka Mishra',subject:'Maths',batch:'B4'});
    await teacher.save();
    res.send(teacher);
})

app.get('/newstu',async(req,res)=>{
    const newstu = new Nstudent({subject:'Sociology',marks:88,attendance:75});
    await newstu.save();
    res.send(newstu);
})

app.get('/nstu',async(req,res)=>{
    const nstu=new Newstudent({subject:'Physics',marks:78,attendance:94}); 
    await nstu.save();
    res.send(nstu)
})




//students routes

app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/addstudent',async(req,res)=>{
    const student=new Student({name:'Aditya Grover',city:'Kanpur',state:'Uttar Pradesh',joinyear:2019,endyear:2023,cg:8.5,gender:'Male',course:'Btech',branch:'CSE'})
    await student.save();
    res.send(student);
})



//Routes for Admin

app.get('/admindata',async(req,res)=>{
    const admin=new Admin({year:2017,fees:112300,hubname:'Dance Hub',totalSpentOnHub:30000,avgcg:7.6,company:'Infosys',offer:70,placed:89})
    await admin.save();
    res.send(admin);
})
app.get('/admins',async(req,res)=>{
    const admins=await Admin.find({});
    res.render('admins/index',{admins})
})

app.get('/admins/new',(req,res)=>{
    res.render('admins/new');
})

app.post('/admins',async(req,res)=>{
    const admin=new Admin(req.body.admin);
    await admin.save();
    console.log(admin);
    res.redirect(`/admins/${admin._id}`)
})
app.get('/admins/:id',async(req,res)=>{
    const admin=await Admin.findById(req.params.id);
    res.render('admins/show',{admin})
})

//That's it for admin


app.use((req,res,next)=>{
    res.locals.currentUser= req.user;
    res.locals.msg_in = req.flash('msg_in')
    res.locals.msg_out = req.flash('msg_out')
    
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    next();
})

app.use('/',require('./routes/index'))
app.use('/',admins)
app.use('/teachers',teachers)
app.use('/students',students)

app.use((req,res,next)=>{
    console.log("Something went wrong!!");
    
    next();
})




app.listen(3000,()=>{
    console.log("serving on port 3000");
}) 