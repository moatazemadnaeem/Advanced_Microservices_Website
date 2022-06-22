import express,{Request,Response} from 'express'
import { Tickets } from '../models/tickets'
import {notfound,NotAuth,validatereq,logedin, BadReqErr} from '@ticketing_app/common_code'
import { body } from 'express-validator'
import { TicketUpdatedPublisher } from '../events/publishers/tikcet-updated-publisher'
import { natsWrapper } from '../nats-wrapper'
const UpdateTickets=express.Router()


UpdateTickets.put('/api/tickets/:id',logedin,[
    body('title').not().isEmpty().withMessage('title should be provided'),
    body('price').isFloat({gt:0}).withMessage('you provided wrong price')
],validatereq,async(req:Request,res:Response)=>{

   const ticket= await Tickets.findById(req.params.id)
   if(!ticket){
       throw new notfound()
   }
   if(ticket.orderId){
       throw new BadReqErr('can not edit reserved ticket')
   }
   if(ticket.userId!==req.currentUser!.id){
       throw new NotAuth('you does not own this ticket')
   }
   ticket.set({
       title:req.body.title,
       price:req.body.price
   })
   await ticket.save()
   await new TicketUpdatedPublisher(natsWrapper.client).publish({
    id:ticket.id,
    title:ticket.title,
    price:ticket.price,
    userId:ticket.userId,
    version:ticket.version
   })
   res.status(200).send(ticket)
})

export {UpdateTickets}