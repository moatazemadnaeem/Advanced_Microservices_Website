import express,{Request,Response} from 'express'
import {notfound} from '@ticketing_app/common_code'
import { Tickets } from '../models/tickets'

const showTickets=express.Router()
showTickets.get('/api/tickets/:id',async(req:Request,res:Response)=>{

   const ticket= await Tickets.findById(req.params.id)
   if(!ticket){
       throw new notfound()
   }
   res.status(200).send(ticket)
})

export {showTickets}

