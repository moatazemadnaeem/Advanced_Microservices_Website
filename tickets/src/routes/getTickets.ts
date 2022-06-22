import express,{Request,Response} from 'express'
import { Tickets } from '../models/tickets'



const GetTickets=express.Router()


GetTickets.get('/api/tickets',async(req:Request,res:Response)=>{

   const tickets= await Tickets.find({
      orderId:undefined
   })
   res.send(tickets)
})

export {GetTickets}