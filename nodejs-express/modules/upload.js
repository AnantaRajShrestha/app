const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://info:shrestha0708@mongodb-ars-zwwl8.mongodb.net/test?retryWrites=true&w=majority',{ useNewUrlParser: true });
var conn = mongoose.Connection;
var Schema = mongoose.Schema;
var uploadSchema = new Schema({
    uploadedBy:String,
    date:String,
    title:String,
imagename:String,

});
var uploadModel = mongoose.model('uploadimage',uploadSchema);
module.exports=uploadModel;