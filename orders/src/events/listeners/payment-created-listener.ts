import { Queue_group_name } from './QueueGroupName';
import {Subjects,PaymentCreatedStruct,Listener,OrderStatus} from '@ticketing_app/common_code'
import {Message} from 'node-nats-streaming'
import {Order} from '../../models/order'

export class PaymentCreatedListener extends Listener<PaymentCreatedStruct>{
subject: Subjects.PaymentCreated=Subjects.PaymentCreated;
queueGroupName=Queue_group_name;

async onMessage(data:PaymentCreatedStruct['data'], msg: Message) {
    const {orderId,stripeId,id} =data
    const order=await Order.findById(orderId)

    if(!order){
        throw new Error('not found')
    }
    order.set({
        status:OrderStatus.Complete
    })
    await order.save()
    msg.ack()
}
} 