import {TicketCreatedListener } from '../ticket-created-listener'
import {Message} from 'node-nats-streaming'
import { TicketCreatedStruct } from '@ticketing_app/common_code'
import { natsWrapper } from '../../../nats-wrapper'
import mongoose from 'mongoose'
import { Ticket } from '../../../models/ticket'
const setup=async()=>{
    //create an instance of listener
    const listener=new TicketCreatedListener(natsWrapper.client)
    //create a fake data object
    const data:TicketCreatedStruct['data']={
        id:new mongoose.Types.ObjectId().toHexString(),
        title:"title",
        version:0,
        price:10,
        userId:new mongoose.Types.ObjectId().toHexString()
    }
   
    //create a fake message object
    //@ts-ignore
     const msg:Message={
        ack:jest.fn()
    }
    return {listener,data,msg}
}

it('creates and save a ticket',async()=>{
    const {listener,data,msg} =await setup()
    //call onMessage function with fake data+ fake message
    await listener.onMessage(data,msg)
    //Write Assertions to make sure ticket is created
    const ticket=await Ticket.findById(data.id)

    expect(ticket).toBeDefined()
    expect(ticket.price).toEqual(data.price)

})

it('acks a message',async()=>{
    const {listener,data,msg} =await setup()
    //call onMessage function with fake data+ fake message

    await listener.onMessage(data,msg)
   
    //Write Assertions to make sure acke function is called

    expect(msg.ack).toHaveBeenCalled()
})