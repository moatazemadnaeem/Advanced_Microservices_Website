import express,{Request,Response} from 'express'
import {body,validationResult} from 'express-validator'
import { add ,user} from '../models/user'
import { BadReqErr,validateincomingreq} from '@ticketing_app/common_code'
import { hashPass } from '../utils/password'
import jwt from 'jsonwebtoken'
export const signup =express.Router()

signup.post('/api/users/signup',

[
body('email').isEmail().withMessage('Email must be valid'),
body('password').trim().isLength({min:6,max:255}).withMessage('Password must be at least 6 chars long and 255 max')
]
,
async(req:Request,res:Response)=>{
    const error =validationResult(req)
    console.log('error:',error.array())
    if(!error.isEmpty()){
        throw new validateincomingreq(error.array())
    }
    const {email,password}=req.body;
    console.log(email)
   const exists=await user.findOne({email})
   if(exists){
    console.log('user already exists')
   throw new BadReqErr('Email is already in use')
   }
   else{
      const User= add({email,password:hashPass(password)})
      await User.save()
      const token= jwt.sign({
          id:User._id,
          email:User.email
      },process.env.JWT_KEY!)
      req.session={
          jwt:token
      }
      return res.status(201).send(User)
   } 

    //res.send(`Hello ${email}`)
})

