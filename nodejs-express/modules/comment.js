var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/employee',{useNewUrlParser:true});
var conn = mongoose.connection;
var Schema = mongoose.Schema;
var commentSchema = new Schema({
comment:String

});
var commentModel = mongoose.model('comment',commentSchema);
module.exports=commentModel;