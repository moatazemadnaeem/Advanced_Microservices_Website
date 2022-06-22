import {validatereq,notfound,logedin, NotAuth, OrderStatus, BadReqErr} from '@ticketing_app/common_code'
import { Order } from '../models/orders'
import { body } from 'express-validator'
import express,{Request,Response} from 'express'
import { stripe } from '../stripe'
import { addPayment } from '../models/payments'
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher'
import { natsWrapper } from '../nats-wrapper'
const newCharge=express.Router()


newCharge.post('/api/payments',logedin,[
    body('token').not().isEmpty(),
    body('orderId').not().isEmpty(),
],validatereq,async(req:Request,res:Response)=>{
    const {token,orderId} =req.body

    const order=await Order.findById(orderId)

    if(!order){
        throw new notfound()
    }
    if(order.userId!==req.currentUser!.id){
        throw new NotAuth('you are not authenticated to do this process')
    }
    if(order.status===OrderStatus.Cancelled){
        throw new BadReqErr('order is expirded')
    }

   const charge= await stripe.charges.create({
        currency:'usd',
        amount:order.price*100,
        source:token
    })

    const payment=addPayment({
        orderId,
        stripeId:charge.id
    })

    await payment.save()
    
    await new PaymentCreatedPublisher(natsWrapper.client).publish({
        id:payment.id,
        orderId:payment.orderId,
        stripeId:payment.stripeId
    })
    res.status(201).send({success:true,id:payment.id})
})

export {newCharge}