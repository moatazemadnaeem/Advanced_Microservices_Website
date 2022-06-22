import express,{Request,Response} from 'express'

export const signout =express.Router()

signout.post('/api/users/signout',(req:Request,res:Response)=>{
    req.session=null
    res.send('signed out')
})

