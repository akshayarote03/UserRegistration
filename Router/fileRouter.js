const express = require('express');
const router = express();
const fileup = require('../Model/fileModel');
const authenticate = require('../middlewares/authenticate');
 
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null,uniqueSuffix+''+file.originalname)
    }
  })
  
const upload = multer({ storage: storage })

router.get('/getfile', authenticate, async (req,res)=>
{
    try
    {
          let result = await fileup.find();
          res.status(200).json({
              message:"get file",
              fileup:result

          })
    }
    catch(e)
    {
       console.error(e); 
    }

})

router.get('/filedownloadwithcode/:id', authenticate, async (req, res)=> {
  try{
    let result = await fileup.findById(req.params.id)
   console.log(result.code);
    let bodycode = req.body.code;

    const file = `${__dirname}/../uploads/${result.filedata}`;
    bodycode === result.code ? res.download(file) : res.status(500).json({
      err:"wrong code"
    })
    
  }
  catch(e)
  {
       console.error(e);
  }

});

router.get('/filedownload/:id',  async (req, res)=> {
  try{
    let result = await fileup.findById(req.params.id)
   //console.log(result.code);
    const file = `${__dirname}/../uploads/${result.filedata}`;
    res.download(file)
    
  }
  catch(e)
  {
       console.error(e);
  }

});


router.post('/fileupload',upload.single("filedata"), authenticate, async (req,res)=>
{
 try
 {
    function betweenRandomNumber(min, max) {  
        return Math.floor(
          Math.random() * (max - min + 1) + min
        )
      }
      betweenRandomNumber();
     
      let code =  + betweenRandomNumber(100000, 999999);
     
    let data = 
    {
        name: req.body.name,
        filedata: req.file.filename,
        code:code
    }
  
    let result = await new fileup(data);
    result.save();
    console.log(result);
    res.status(200).json({
        message:"file uploaded",
        fileup:result
    })

 }
 catch(e)
 {
        console.error(e);
        res.status(400).json({
            fileup:null
        })
 }

}) 




router.delete('/deletefile/:id', authenticate, async(req,res)=>
{
    try{
          let result = await fileup.findByIdAndDelete(req.params.id);
          res.status(200).json(result)
    }
    catch
    {
        res.status(400).json({
            fileup:null
        })
     }
    
})
module.exports=router