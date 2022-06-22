import {OrderCreatedListener } from '../order-created-listener'
import {Message} from 'node-nats-streaming'
import { OrderCreatedStruct,OrderStatus } from '@ticketing_app/common_code'
import { natsWrapper } from '../../../nats-wrapper'
import mongoose from 'mongoose'
import { Order,add } from '../../../models/orders'
const setup=async()=>{
    //create an instance of listener
    const listener=new OrderCreatedListener(natsWrapper.client)

    //create a fake data object
    const data:OrderCreatedStruct['data']={
        id:new mongoose.Types.ObjectId().toHexString(),
        userId: 'user',
        status: OrderStatus.Created,
        version: 0,
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

it('should save an order to orders collection',async()=>{
   const {listener,msg,data} =await setup()

    await listener.onMessage(data,msg)

   const __Order=await Order.findById(data.id)

   expect(__Order.price).toEqual(data.ticket.price)

})

it('acks a message',async()=>{
    const {listener,data,msg} =await setup()
    //call onMessage function with fake data+ fake message

    await listener.onMessage(data,msg)
   
    //Write Assertions to make sure acke function is called

    expect(msg.ack).toHaveBeenCalled()
})
