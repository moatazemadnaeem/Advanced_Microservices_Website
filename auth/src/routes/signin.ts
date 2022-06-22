import express,{Request,Response} from 'express'
import {body} from 'express-validator'
import {user} from '../models/user'
import { BadReqErr,validatereq } from '@ticketing_app/common_code'
import {comparePass} from '../utils/password'
import jwt from 'jsonwebtoken'

export const signin =express.Router()

signin.post('/api/users/signin',

[
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({min:6,max:255}).withMessage('Password must be at least 6 chars long and 255 max')
]
,
validatereq
,
async(req:Request,res:Response)=>{

    const {email,password}=req.body;
    //if user exist

    const existingUser=await user.findOne({email})
    if(!existingUser){
        throw new BadReqErr('invalid creds ')
    }

    //check password
    const validate=comparePass(password,existingUser.password)
    if(!validate){
        throw new BadReqErr('invalid creds ')
    }

    //send jwt 
    const token= jwt.sign({
        id:existingUser._id,
        email:existingUser.email
    },process.env.JWT_KEY!)
    req.session={
        jwt:token
    }
    console.log(existingUser)
    //send data
    res.status(200).send(existingUser)
})

