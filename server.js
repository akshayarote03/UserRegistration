
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotEnv = require ('dotenv');
const userRouter = require('./Router/userRouter');
const fileRouter = require('./Router/fileRouter')
const app = express();
port = 3333;



app.use(express.json());
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
app.use("/user",userRouter);
app.use("/file",fileRouter);

dotEnv.config({path:'./config/config.env'})

mongoose.connect(process.env.localurl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then((res)=>{
    console.log("Database Connected.......!");
}).catch((e)=>
{
    console.error(e);
})

app.listen(port,()=>{
    console.log("Server Started On Port No 3333........!");
})