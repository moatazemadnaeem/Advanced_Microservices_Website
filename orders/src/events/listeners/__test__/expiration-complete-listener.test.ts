import {ExpirationCompleteListener } from '../expiration-complete-listener'
import {Message} from 'node-nats-streaming'
import { ExpirationCompleteStruct,OrderStatus } from '@ticketing_app/common_code'
import { natsWrapper } from '../../../nats-wrapper'
import mongoose from 'mongoose'
import { Ticket,addTicketOrder } from '../../../models/ticket'
import { Order,add } from '../../../models/order'
const setup=async()=>{
    //create an instance of listener
    const listener=new ExpirationCompleteListener(natsWrapper.client)

    //create a ticket
    const ticket= addTicketOrder({
        title:'hello',
        price:20,
        id:new mongoose.Types.ObjectId().toHexString()
    })
    await ticket.save()
    //create order
    const order=add({
        status:OrderStatus.Created,
        userId:'moataz',
        expiresAt:new Date(),
        ticket
    })
    await order.save()
    //create a fake data object
    const data:ExpirationCompleteStruct['data']={
        orderId:order.id
    }
   
    //create a fake message object
    //@ts-ignore
     const msg:Message={
        ack:jest.fn()
    }
    return {listener,data,msg,ticket,order}
}

it('update order status to cancelled',async()=>{
    
    const {listener,data,msg,ticket,order}=await setup()

    await listener.onMessage(data,msg)

    const __order= await Order.findById(order.id)

    expect(__order.status).toEqual(OrderStatus.Cancelled)
})

it('emit order cancelled event',async()=>{
    const {listener,data,msg,ticket,order}=await setup()

    await listener.onMessage(data,msg)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('ack the message',async()=>{
    const {listener,data,msg} =await setup()
    //call onMessage function with fake data+ fake message

    await listener.onMessage(data,msg)
   
    //Write Assertions to make sure acke function is called

    expect(msg.ack).toHaveBeenCalled()
})

