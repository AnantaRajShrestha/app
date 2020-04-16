
var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://info:shrestha0708@mongodb-ars-zwwl8.mongodb.net/test?retryWrites=true&w=majority');
var conn = mongoose.connection;
var Schema = mongoose.Schema;
var homeSchema = new Schema({
title:String,
content:String,
image:String,
author:String,
date:String
});
var homeModel = mongoose.model('homepage',homeSchema);
module.exports=homeModel;