import {OrderCancelledListener } from '../order-cancelled-listener'
import {Message} from 'node-nats-streaming'
import { OrderCancelledStruct,OrderStatus } from '@ticketing_app/common_code'
import { natsWrapper } from '../../../nats-wrapper'
import mongoose from 'mongoose'
import { Order,add } from '../../../models/orders'
const setup=async()=>{
    //create an instance of listener
    const listener=new OrderCancelledListener(natsWrapper.client)
    const order=add({
        id:new mongoose.Types.ObjectId().toHexString(),
        userId:'moataz',
        status:OrderStatus.Created,
        version:0,
        price:20
      
    })
    await order.save()
    //create a fake data object
    const data:OrderCancelledStruct['data']={
        id:order.id,
        userId: 'user',
        status: OrderStatus.Created,
        version: 1,
        expiresAt: 'date',
        ticket: {
            id:'ticket.id',
            price:20
        }
    }
   
    //create a fake message object
    //@ts-ignore
     const msg:Message={
        ack:jest.fn()
    }
    return {listener,data,msg}
}

it('should set order status to cancelled',async()=>{
   const {listener,msg,data} =await setup()

   await listener.onMessage(data,msg)

   const __Order=await Order.findById(data.id)

   expect(__Order.status).toEqual(OrderStatus.Cancelled)

})

it('acks a message',async()=>{
    const {listener,data,msg} =await setup()
    //call onMessage function with fake data+ fake message

    await listener.onMessage(data,msg)
   
    //Write Assertions to make sure acke function is called

    expect(msg.ack).toHaveBeenCalled()
})
