import express,{Request,Response} from 'express'
import {validatereq,notfound,OrderStatus,BadReqErr} from '@ticketing_app/common_code'
import { body } from 'express-validator'
import {logedin} from '@ticketing_app/common_code'
import mongoose from 'mongoose'
import { Ticket } from '../models/ticket'
import { Order,add } from '../models/order'
import { natsWrapper } from '../nats-wrapper'
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'
const new_orders=express.Router()
const EXPIRATION_SECONDS=1*60;
new_orders.post('/api/orders',logedin,
[
body('ticketId')
    .not()
    .isEmpty()
    .custom((input:string)=>mongoose.Types.ObjectId.isValid(input))
    .withMessage('TicketId must be provided')
]
, 
validatereq
,
async(req:Request,res:Response)=>{

    const {ticketId}=req.body;

    //Find the ticket that the user is trying to order
    const ticket =await Ticket.findById(ticketId)

    if (!ticket){
        throw new notfound();
    }

    //Make Sure that this ticket is not already reserved
    //Run query to look at all orders. find an order where the ticket
    //is equal to the ticket that the user provided and the order status is not cancelled
    //if we found this order that simply means the order is reserved by a user

    const existingOrder=await Order.findOne({
        ticket:ticketId,
        status:{
            $in:[
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    })

    if(existingOrder){
        throw new BadReqErr('Ticket is already reserved')
    }
    //Calculate an expiration date for this order
    const expiration=new Date()
    expiration.setSeconds(expiration.getSeconds()+EXPIRATION_SECONDS)

    //Build order and save it to the DB
    const order=add({
        userId:req.currentUser!.id,
        status:OrderStatus.Created,
        expiresAt:expiration,
        ticket
    })

    await order.save()

    //Publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
        id:order.id,
        status:order.status,
        userId:order.userId,
        version: order.version,
        expiresAt:order.expiresAt.toISOString(),
        ticket:{
            id:ticket.id,
            price:ticket.price
        }
    })


    
    res.status(201).send(order)
})
export {new_orders}