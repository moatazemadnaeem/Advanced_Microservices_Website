import { app } from "../app";
//import request from 'supertest'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
export const getcookie=(id?:string)=>{
   //generate a payload 
    const payload={id:id||new mongoose.Types.ObjectId().toHexString(),email:"test@test.com"}
   //we will sign in jwt 
    const token = jwt.sign(payload,process.env.JWT_KEY!)
   //create session object 
    const session={jwt:token}
   //formate it to JSON
    const sessionJson=JSON.stringify(session)
   //encode it to base64
    const base64=Buffer.from(sessionJson).toString('base64')
   //return the cookie back as string 
   return [`session=${base64}`]
}