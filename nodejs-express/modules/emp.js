var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://info:shrestha0708@mongodb-ars-zwwl8.mongodb.net/test?retryWrites=true&w=majority',{ useNewUrlParser: true });


var conn = mongoose.connection;
var Schema = mongoose.Schema;
var employeeSchema = new Schema({
name:String,
email:String,
phone:Number,
password:String,

});
var employeeModel = mongoose.model('employee',employeeSchema);
module.exports=employeeModel;
/*var employees = new employeeModel({name:'Prakash Shrestha',email:'pk@gmail.com',phone:9864421034,password:'tanahun'});
console.log(employees);
conn.on("connected",function()
{
console.log('connected successfully');
});
conn.on("disconnected",function()
{
console.log('disconnected successfully');
});
conn.on('error',console.error.bind(console,'connection error:'));
//insert data
/*conn.once('open',function()
{
    employees.save(function(err,res)
    {
        if(err) throw error;
        console.log(res);
        conn.close();
    });

});*/
//display all
/*
employeeModel.find({name:'ars.com.np'},function(err,data)
{
    if(err) throw error;
    console.log(data);
    conn.close();
});*/
//update by id
/*
employeeModel.findOneAndUpdate({email:'pk@gmail.com'},{email:'tulstha@gmail.com'},function(err,data)
{
    if(err) throw error;
    console.log(data);
    conn.close();
});*/

