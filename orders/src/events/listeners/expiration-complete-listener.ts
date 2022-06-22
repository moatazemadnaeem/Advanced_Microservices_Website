import { Queue_group_name } from './QueueGroupName';
import {Subjects,ExpirationCompleteStruct,Listener,OrderStatus} from '@ticketing_app/common_code'
import {Message} from 'node-nats-streaming'
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';
export class ExpirationCompleteListener extends Listener<ExpirationCompleteStruct>{
subject: Subjects.ExpirationComplete=Subjects.ExpirationComplete;
queueGroupName=Queue_group_name;

async onMessage(data:ExpirationCompleteStruct['data'], msg: Message) {
    
    const order=await Order.findById(data.orderId).populate('ticket')

    if(!order){
        throw new Error('can not find an order')
    }
    if(order.status===OrderStatus.Complete){
        return msg.ack()
    }
    order.set({
        status:OrderStatus.Cancelled
    })
    await order.save()
    new OrderCancelledPublisher(this.client).publish({
        id:order.id,
        status:order.status,
        userId:order.userId,
        version: order.version,
        expiresAt:order.expiresAt.toISOString(),
        ticket:{
            id:order.ticket.id,
            price:order.ticket.price
        }
    })
    msg.ack()
}
} 