import request from "supertest";
import { app } from '../../app'
import { Order ,add} from "../../models/orders";
import {getcookie} from '../../test/helperauth'
import mongoose from 'mongoose'
import { OrderStatus } from "@ticketing_app/common_code";
import {stripe} from '../../stripe'
import {Payments,addPayment} from '../../models/payments'
jest.mock('../../stripe');

it('should return 404 when the order is not found',async()=>{
   await request(app)
   .post('/api/payments')
   .set('Cookie',getcookie())
   .send({
       token:'token',
       orderId:new mongoose.Types.ObjectId().toHexString()
   })
   .expect(404)
})
it('should return 401 when the user does not have the order',async()=>{

    const order=add({
        id:new mongoose.Types.ObjectId().toHexString(),
        userId:new mongoose.Types.ObjectId().toHexString(),
        price:20,
        version:0,
        status:OrderStatus.Created
    })
    await order.save()
    await request(app)
    .post('/api/payments')
    .set('Cookie',getcookie())
    .send({
        token:'token',
        orderId:order.id
    })
    .expect(401)

})
it('should return 400 when the order is expired',async()=>{
    const userId=new mongoose.Types.ObjectId().toHexString()
    const order=add({
        id:new mongoose.Types.ObjectId().toHexString(),
        userId,
        price:20,
        version:0,
        status:OrderStatus.Cancelled
    })
    await order.save()
    await request(app)
    .post('/api/payments')
    .set('Cookie',getcookie(userId))
    .send({
        token:'token',
        orderId:order.id
    })
    .expect(400)
})

it('should charges a credit card',async()=>{
    const userId=new mongoose.Types.ObjectId().toHexString()
    const order=add({
        id:new mongoose.Types.ObjectId().toHexString(),
        userId,
        price:20,
        version:0,
        status:OrderStatus.Created
    })
    await order.save()
    await request(app)
    .post('/api/payments')
    .set('Cookie',getcookie(userId))
    .send({
        token:'tok_visa',
        orderId:order.id
    })
    .expect(201)

    const chargesOptions=(stripe.charges.create as jest.Mock).mock.calls[0][0]

    expect(chargesOptions.currency).toEqual('usd')
    expect(chargesOptions.amount).toEqual(order.price*100)
    expect(chargesOptions.source).toEqual('tok_visa')

})
it('should add record to payment collection that indicates an order is being purchased',async()=>{
    const userId=new mongoose.Types.ObjectId().toHexString()
    const order=add({
        id:new mongoose.Types.ObjectId().toHexString(),
        userId,
        price:20,
        version:0,
        status:OrderStatus.Created
    })
    await order.save()
    await request(app)
    .post('/api/payments')
    .set('Cookie',getcookie(userId))
    .send({
        token:'tok_visa',
        orderId:order.id
    })
    .expect(201)

    const chargesOptions=(stripe.charges.create as jest.Mock).mock.calls[0][0]

    expect(chargesOptions.currency).toEqual('usd')
    expect(chargesOptions.amount).toEqual(order.price*100)
    expect(chargesOptions.source).toEqual('tok_visa')

   const __payment= await Payments.findOne({orderId:order.id})

   expect(__payment).not.toBeNull()
   expect(__payment.stripeId).toEqual('fake_stripe_id')

})