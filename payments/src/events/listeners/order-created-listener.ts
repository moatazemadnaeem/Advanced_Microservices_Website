import { Listener ,OrderCreatedStruct,Subjects} from "@ticketing_app/common_code";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import {add,Order} from '../../models/orders'
export class OrderCreatedListener extends Listener<OrderCreatedStruct>{

    subject: Subjects.OrderCreated=Subjects.OrderCreated;
    queueGroupName=queueGroupName;
    async onMessage(data:OrderCreatedStruct['data'], msg: Message){
       const order= add({
            id:data.id,
            status:data.status,
            price:data.ticket.price,
            version:data.version,
            userId:data.userId
        })
        await order.save()
        msg.ack()
    }

}