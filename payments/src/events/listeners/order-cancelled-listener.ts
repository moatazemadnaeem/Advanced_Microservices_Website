import { Listener ,OrderCancelledStruct,OrderStatus,Subjects} from "@ticketing_app/common_code";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/orders";
export class OrderCancelledListener extends Listener<OrderCancelledStruct>{

    subject: Subjects.OrderCancelled=Subjects.OrderCancelled;
    queueGroupName=queueGroupName;
    async onMessage(data:OrderCancelledStruct['data'], msg: Message){
        //Find a ticket to mark it as preserved
        const order=await Order.findOne({
            _id:data.id,
            version:data.version-1
        })
        //If there is not ticket throw an error
        if(!order){
            throw new Error('Ticket not found')
        }
        //Set orderId to data.id 
        order.set({status:OrderStatus.Cancelled})
        //Save the ticket
        await order.save()
        //Ack the message
        msg.ack()
    }

}