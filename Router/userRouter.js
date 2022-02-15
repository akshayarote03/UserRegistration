const express = require('express');
const router = express();
const user = require('../Model/userModel');
const bcrypt = require('bcrypt')
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');



router.post('/registration' ,
[
       check('username').notEmpty().withMessage('UserName is required......'),
       check('password').isLength({min:6}).withMessage('Incorrect Password.....Length Should Be GreterThan 6')
], async (req,res)=>
{
     let error=validationResult(req);
     if(!error.isEmpty())
     {
         res.status(400).json({error:error.array()});
     }
     
     try
     {
         let salt = await bcrypt.genSalt(10);
        let password2 = await bcrypt.hash(req.body.password,salt);
          let data=
          {
              username:req.body.username,
              password:password2
          } 

         
          let result = await new user(data);
          console.log(result);
          result.save();
         
          res.status(200).json({
              message:"User Added SucessFully",
              user:result

          })
        
         
     }
     
     catch(e)
     { 
         console.error(e)
          res.status(500).json({
              error:err
          })
     }
}
)
 
router.post('/login',
[
    check('username').notEmpty().withMessage('Enter The Correct User Name'),
    check('password').isLength({min:6}).withMessage('Enter The Correct Password')
],async (req,res)=>
{
    let error=validationResult(req);
     if(!error.isEmpty())
     {
         res.status(400).json({error:error.array()});
     }
    try
    {
        let {username,password}= req.body;
        let result = await user.findOne({username:username})
        if(!result)
        {
            res.status(400).json({
               message:"Invalid User"
            })
        }
        let isMatch = await bcrypt.compare(password,result.password)
        if(!isMatch)
        {
            res.status(400).json({
                message:"invalid password"
            })
        }

        let payload = {
            user : {
                id:user._id
            }
        };
        jwt.sign(payload,process.env.JWT_SECRET_KEY,(err,token)=>
        {
            if(err) throw  err;
            res.status(200).json(
                {
                    result:"Login Successfully",
                    token:token
                }
            )
        })
    }
    catch(e)
    {
        console.error(e);
        res.status(500).json({
            message:"Login Fail"
        })

    }
}
)


router.delete('/deleteuser/:id', async (req,res)=>
{
 
    try
    {
       let result = await user.findByIdAndDelete(req.params.id);
       console.log(result);
       res.status(200).json(
           {
               message:"User Deleted Successfully",
               user:result
           }
       )


    }
    catch(e)
    {
         console.error(e);
         res.status(400).json({user:null})    
  
    }

})

module.exports=router



