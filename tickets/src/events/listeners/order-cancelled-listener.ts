import { Listener ,OrderCancelledStruct,Subjects} from "@ticketing_app/common_code";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Tickets } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publishers/tikcet-updated-publisher";
export class OrderCancelledListener extends Listener<OrderCancelledStruct>{

    subject: Subjects.OrderCancelled=Subjects.OrderCancelled;
    queueGroupName=queueGroupName;
    async onMessage(data:OrderCancelledStruct['data'], msg: Message){
        //Find a ticket to mark it as preserved
        const ticket=await Tickets.findById(data.ticket.id)
        //If there is not ticket throw an error
        if(!ticket){
            throw new Error('Ticket not found')
        }
        //Set orderId to data.id 
        ticket.set({orderId:undefined})
        //Save the ticket
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