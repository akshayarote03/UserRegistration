const mongoose = require('mongoose');


const fileschema= new mongoose.Schema({
    name:
    {
        type:String
    },
    filedata:
    {
      type:String
    },
    code:
    {
      type:String
    }
})

module.exports=mongoose.model("fileup",fileschema)