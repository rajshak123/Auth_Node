/**
 * Created by raj on 7/14/2017.
 */
const mongoose=require('mongoose');
mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost:27017/todoApp');
module.exports={mongoose}