import { Listener ,OrderCreatedStruct,Subjects} from "@ticketing_app/common_code";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Tickets } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publishers/tikcet-updated-publisher";
export class OrderCreatedListener extends Listener<OrderCreatedStruct>{

    subject: Subjects.OrderCreated=Subjects.OrderCreated;
    queueGroupName=queueGroupName;
    async onMessage(data:OrderCreatedStruct['data'], msg: Message){
        //Find a ticket to mark it as preserved
        const ticket=await Tickets.findById(data.ticket.id)
        //If there is not ticket throw an error
        if(!ticket){
            throw new Error('Ticket not found')
        }
        //Set orderId to data.id 
        ticket.set({orderId:data.id})
        //Save the ticket

        //Imagine you did not publish event saying an ticket is updated what will happen 
        //after creating and cancell an order for example version will be 2 and let us imagine when you want to 
        //update a ticket the version will be 3 for example 
        //orders service will not be able to find the ticket because it have an older version 
        await ticket.save()
        await new TicketUpdatedPublisher(this.client).publish({
            id:ticket.id,
            title:ticket.title,
            version:ticket.version,
            userId:ticket.userId,
            orderId:ticket.orderId,
            price:ticket.price
        })
        //Ack the message
        msg.ack()
    }

}