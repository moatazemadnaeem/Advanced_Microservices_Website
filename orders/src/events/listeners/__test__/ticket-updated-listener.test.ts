import {TicketUpdatedListener } from '../ticket-updated-listener'
import {Message} from 'node-nats-streaming'
import { TicketUpdatedStruct } from '@ticketing_app/common_code'
import { natsWrapper } from '../../../nats-wrapper'
import mongoose from 'mongoose'
import { Ticket ,addTicketOrder} from '../../../models/ticket'
const setup=async()=>{
    //create an instance of listener
    const listener=new TicketUpdatedListener(natsWrapper.client)

    //generate a ticket
    const ticket=addTicketOrder({
        id:new mongoose.Types.ObjectId().toHexString(),
        title:'concert',
        price:10
    })
    await ticket.save()
    //create a fake data object
    const data:TicketUpdatedStruct['data']={
        id:ticket.id,
        title:"new concert",
        version:ticket.version+1,
        price:100,
        userId:new mongoose.Types.ObjectId().toHexString()
    }
   
    //create a fake message object
    //@ts-ignore
     const msg:Message={
        ack:jest.fn()
    }
    return {listener,data,msg,ticket}
}

it('creates and update a ticket',async()=>{
   const {listener,data,msg,ticket} =await setup()

   await listener.onMessage(data,msg)

   const __ticket=await Ticket.findById(data.id)

   expect(__ticket).toBeDefined()
   expect(__ticket.price).not.toEqual(ticket.price)
   expect(__ticket.price).toEqual(data.price)
   expect(__ticket.version).toEqual(ticket.version+1)
})

it('acks a message',async()=>{
    const {listener,data,msg} =await setup()
    //call onMessage function with fake data+ fake message

    await listener.onMessage(data,msg)
   
    //Write Assertions to make sure acke function is called

    expect(msg.ack).toHaveBeenCalled()
})
it('should not acks a message if there is skipped version or event ',async()=>{
    const {listener,data,msg} =await setup()
    data.version=10
    try{
        await listener.onMessage(data,msg)
    }catch(err){}
   

    expect(msg.ack).not.toHaveBeenCalled()
})