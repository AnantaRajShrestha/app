/* 
//to create package.json
npm init
//to install express
 npm install  express
 //to install express with dependency with .json
 npm install  express -save
 //to install nodemon
 npm install nodemon -g
 Note: -g means once install nodemon it will not necessary to reinstall  in later project
 */
var date = new Date();
var express = require('express');
var app = express();
var bcrypt = require('bcryptjs');
var passport = require('passport');
var multer = require('multer');
var flash = require("express-flash");
var session = require('express-session');
var cookieparser = require('cookie-parser');
var path = require('path');
var empModel = require('./modules/emp');
var homeModel = require('./modules/home')
var uploadModel = require('./modules/upload');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false});

var employee=empModel.find({}).sort({name:1});
var home=homeModel.find({}).sort({date:-1});
var imageData=uploadModel.find({});
var emp = empModel.findOne({});

app.set('view engine','ejs');
app.use('/assets',express.static('assets'));

app.use(cookieparser('secret'));
app.use(session({
   secret:'secret',
   maxAge:3600000,
   resave:true,
   
   saveUninitialized:true,

}));
 app.use(passport.initialize());
app.use(passport.session());
var checkAuthentication = function(req,res,next)
{
   if(req.isAuthenticated())
   {
      // res.set('Cache-Control','no-cache,private,no-store,');
      return next();
   }else{
      res.redirect('/login');
   }
}

app.get('/',function(req,res)
{
   

   home.exec(function(err,data)
   {
    if(err) throw err;
    res.render('index',{title:'ioe.ngu.com.np',date:Date.now(),records:data,success:' '});
   });



 

});




var Storage = multer.diskStorage(
   {
      destination:"./assets/img/",
      filename:(req,file,cb)=>{
      cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
   }
   });
   var upload = multer({
      storage:Storage
   }).single('file');
   app.get('/upload',function(req,res)
{
   

   imageData.exec(function(err,data)
   {
    if(err) throw err;
    res.render('upload',{title:'ioe.ngu.com.np',records:data,date:date,success:' '});
   });

});
app.post('/upload',upload,function(req,res)
{

   var imagename=req.file.filename;
var success =req.file.filename+'uploaded successfully';
  var imageDetails = new uploadModel({
     uploadedBy:req.body.name,
     date:req.body.date,
     title:req.body.title,
     imagename:imagename,
  });
  imageDetails.save(function(err,doc)
  {
    if(err) throw err;
    imageData.exec(function(err,data)
    {
     if(err) throw err;
     res.render('upload',{titled:'ioe.ngu.com.np',records:data,title:'ioe.ngu.com.np',date:date,success:success});
    });

  });

 

});
app.get('/add-post',checkAuthentication,function(req,res)

{
  
   home.exec(function(err,data)
   {   // res.sendFile(__dirname+'/index.html');
      if(err) throw error;
 
   res.render('add-post',{title:'ioe.ngu.com.np',records:data,date:date,success:"",name:req.user.name});

     });
});
app.post('/add-post',checkAuthentication,upload,urlencodedParser,function(req,res)
{
   
   var homeDetails = new homeModel({
 
 title:req.body.title,
 content:req.body.content,
 image:req.file.filename,
 author:req.body.author,
 date:req.body.date,
   });
homeDetails.save(function(err,res1)
{ 
   if(err) throw err;
   home.exec(function(err,data)
{  
   if(err) throw error;

res.render('index',{title:'ioe.ngu.com.np',records:data,success:'New data added successfully'});

  });

});
});
app.get('/register',function(req,res)

{
  
   employee.exec(function(err,data)
   {   // res.sendFile(__dirname+'/index.html');
      if(err) throw error;

   res.render('register',{title:'ioe.ngu.com.np',records:data,success:""});

     });
});
app.post('/register',urlencodedParser,function(req,res)
{
   // res.sendFile(__dirname+'/index.html');
   //get method ,res.render('contact',{qs:req.query});
   var err;
   if(!req.body.username ||!req.body.email ||!req.body.phone ||!req.body.password )
   {
      err ="Please Fill All The Field...";
      res.render('register',{title:'ioe.ngu.com.np',records:'',err:err});
   }
   bcrypt.genSalt(10,function(err,salt)
   {
      if(err) throw err;
      bcrypt.hash(req.body.password,salt,function(err,hash)
   {
      if(err) throw err;
      var empDetails = new empModel({
 
         name:req.body.username,
         email:req.body.email,
         phone:req.body.phone,
         
         password:hash,
     
        });
        empDetails.save(function(err,res1)
{ 
   if(err) throw err;
   employee.exec(function(err,data)
{   // res.sendFile(__dirname+'/index.html');
   if(err) throw error;

res.redirect('/');

  });

    
   });
   });

  


});
});

app.get('/delete/:id',function(req,res)

{
  var id= req.params.id;
 var del = empModel.findByIdAndDelete(id);
del.exec(function(err,data1)
{
if(err) throw err;
   res.redirect('/');
});


   

});


app.get('/edit/:id',function(req,res)

{
  var id= req.params.id;
 var edit = empModel.findById(id);
edit.exec(function(err,data)
{
if(err) throw err;
   res.render('edit',{title:'ioe.ngu.com.np',records:data});
});

});

app.post('/update/',urlencodedParser,function(req,res)
{
 
   bcrypt.genSalt(10,function(err,salt)
   {
      if(err) throw err;
      bcrypt.hash(req.body.password,salt,function(err,hash)
   {
      if(err) throw err;
      var change =empModel.findByIdAndUpdate(req.body.id,{
         name:req.body.username,
         email:req.body.email,
         phone:req.body.phone,
         password:hash,
        });
     change.exec(function(err,data)
     {
        if(err) throw err;
     
     
     res.render("index",{title:'ioe.ngu.com.np',records:data,success:'Updated successfully'});
     
       });
    
   });
   });

   

});

// Authentication Strategy
var localStrategy= require('passport-local').Strategy;
passport.use(new localStrategy({
   usernameField:'username',

},(username,password,done)=>
{
   empModel.findOne({name:username},(err,data)=>{
   if(err) throw err;
   if(!data)
   {
      console.log('data not found');
      return done(null,false);
   }
  
   bcrypt.compare(password,data.password,(err,match)=>{
      if(err)
      {
         return done(null,false); 
      }
      if(!match)
      {
         console.log('password wrong');
         return done(null,false);
      }
      if(match)
      {
         return done(null,data);
      }
   })
   
   });
}));
passport.serializeUser(function(user,cb)
{
   cb(null,user.id);
  //console.log(user);
});

passport.deserializeUser(function(id,cb)
{
   empModel.findById(id,function(err,user)
   {
      cb(err,user)
   });
});

//end of authenticate
app.get('/login/',function(req,res)

{
  


   res.render('login',{title:'ioe.ngu.com.np',success:""});

});
app.post('/loginto',urlencodedParser,(req,res,next)=>

{

passport.authenticate('local',{
   successRedirect:'/dashboard',
   failureRedirect:'/login',

 
})(req,res,next);


});
app.get('/logout',checkAuthentication,(req,res)=>
{
req.logout();
res.redirect('/login');
});
app.get('/dashboard',checkAuthentication,(req,res)=>
{
   
   res.render('dashboard',{title:'ioe.edu.com.np',name:req.user.name});
})

app.get('/search',checkAuthentication,function(req,res)
{
   employee.exec(function(err,data)
   {   // res.sendFile(__dirname+'/index.html');
      if(err) throw error;

   res.render('search',{title:'ioe.ngu.com.np',records:data,name:req.user.name,success:""});

     });
});
app.post('/search/',urlencodedParser,function(req,res)
{
   // res.sendFile(__dirname+'/index.html');
   //get method ,res.render('contact',{qs:req.query});
  var username= req.body.searchbyusername;
//   var email= req.body.searchbyemail;
// if(username != ' ' && email != ' ')
// {
//    var result = {$and:[{name:username},{email:email}]};
// }else if(username != ' ' && email =='')
// {
//    var result= {name:username};
// }
// else if(username == ' ' && email !='')
// {
//    var result= {email:email};
// }
// else
// {
//    var result ={};
// }

empsearch = empModel.find({name:username});
   empsearch.exec(function(err,data)
{  
   if(err) throw error;

res.render('search',{title:'ioe.ngu.com.np',records:data});

 

});
});
app.post('/search2/',urlencodedParser,function(req,res)
{
 
  var title= req.body.title;

search = uploadModel.find({title:title});
   search.exec(function(err,data)
{  
   if(err) throw error;

res.render('upload',{title:'ioe.ngu.com.np',records:data,date:date,success:''});

 

});
});

// app.get('/dashboard/:name',function(req,res)
// {
//    emp.exec(function(err,data1)
//    {
//       if(err) throw error;
      
//    // res.sendFile(__dirname+'/index.html');
//    res.render('dashboard',{title:'ioe.ngu.com.np',data:req.params.name});
// });
//    // res.send('You are requested to see profile of'+req.params.name);
//    // res.render('profile',{person:req.params.name,data:data});
 
// });
app.use(function(req,res)
{
res.status(404).render("404");
});

app.get("/comment",function(req,res)
{

});


app.listen(8000);
