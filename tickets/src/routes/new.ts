import express,{Request,Response} from 'express'
import {validatereq} from '@ticketing_app/common_code'
import { body } from 'express-validator'
import {logedin} from '@ticketing_app/common_code'
import { add,Tickets } from '../models/tickets'
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const createTickets=express.Router()
createTickets.post('/api/tickets',logedin,[
    body('title').not().isEmpty().withMessage('title should be provided'),
    body('price').isFloat({gt:0}).withMessage('you provided wrong price')
],validatereq,async(req:Request,res:Response)=>{
    const {title,price}=req.body;

    const ticket=add({title,price,userId:req.currentUser!.id})
    await ticket.save()
    await new TicketCreatedPublisher(natsWrapper.client).publish({
        id:ticket.id,
        title:ticket.title,
        price:ticket.price,
        userId:ticket.userId,
        version:ticket.version
    })
    res.status(201).send(ticket)
})
export {createTickets}