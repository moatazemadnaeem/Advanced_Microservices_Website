import {OrderCancelledListener } from '../order-cancelled-listener'
import {Message} from 'node-nats-streaming'
import { OrderCancelledStruct,OrderStatus } from '@ticketing_app/common_code'
import { natsWrapper } from '../../../nats-wrapper'
import mongoose from 'mongoose'
import { Tickets,add } from '../../../models/tickets'
const setup=async()=>{
    //create an instance of listener
    const listener=new OrderCancelledListener(natsWrapper.client)

    const orderId=new mongoose.Types.ObjectId().toHexString()
    //Create a ticket and save it
    const ticket=add({
        title:'concert',
        price:10,
        userId:'user'
    })
    ticket.set({orderId})
    //Save the ticket
    await ticket.save()
    //create a fake data object
    const data:OrderCancelledStruct['data']={
        id:orderId,
        userId: 'user',
        status: OrderStatus.Cancelled,
        version: 0,
        expiresAt: 'date',
        ticket: {
            id: ticket.id,
            price:ticket.price
        }
    }
   
    //create a fake message object
    //@ts-ignore
     const msg:Message={
        ack:jest.fn()
    }
    return {listener,data,msg,ticket,orderId}
}

it('should unset orderId to the ticket',async()=>{
   const {listener,msg,ticket,data} =await setup()

   await listener.onMessage(data,msg)

   const __ticket=await Tickets.findById(ticket.id)

   expect(__ticket.orderId).not.toBeDefined()

})

it('acks a message',async()=>{
    const {listener,data,msg} =await setup()
    //call onMessage function with fake data+ fake message

    await listener.onMessage(data,msg)
   
    //Write Assertions to make sure acke function is called

    expect(msg.ack).toHaveBeenCalled()
})
it('should publish ticket updated event',async()=>{
    const {listener,data,msg,ticket} =await setup()
    //call onMessage function with fake data+ fake message

    await listener.onMessage(data,msg)
   
    //Write Assertions to make sure acke function is called and publish function

    expect(natsWrapper.client.publish).toHaveBeenCalled()
    expect((natsWrapper.client.publish as jest.Mock).mock.calls.length).toEqual(1)
})