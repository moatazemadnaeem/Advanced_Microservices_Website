import {OrderCreatedListener } from '../order-created-listener'
import {Message} from 'node-nats-streaming'
import { OrderCreatedStruct,OrderStatus } from '@ticketing_app/common_code'
import { natsWrapper } from '../../../nats-wrapper'
import mongoose from 'mongoose'
import { Tickets,add } from '../../../models/tickets'
const setup=async()=>{
    //create an instance of listener
    const listener=new OrderCreatedListener(natsWrapper.client)

    //Create a ticket and save it
    const ticket=add({
        title:'concert',
        price:10,
        userId:'user'
    })
    //Save the ticket
    await ticket.save()
    //create a fake data object
    const data:OrderCreatedStruct['data']={
        id:new mongoose.Types.ObjectId().toHexString(),
        userId: 'user',
        status: OrderStatus.Created,
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
    return {listener,data,msg,ticket}
}

it('should set orderId to the ticket',async()=>{
   const {listener,msg,ticket,data} =await setup()

   await listener.onMessage(data,msg)

   const __ticket=await Tickets.findById(ticket.id)

   expect(__ticket.orderId).toEqual(data.id)

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