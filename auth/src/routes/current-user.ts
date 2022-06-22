import express,{Request,Response} from 'express'
import { ExtractPayload } from '@ticketing_app/common_code'
export const current =express.Router()

current.get('/api/users/current-user',ExtractPayload,(req:Request,res:Response)=>{
//check first is the session object exist and then check jwt
    return res.send({currentUser:req.currentUser||null})
})

