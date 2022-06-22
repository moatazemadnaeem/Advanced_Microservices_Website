import {Subjects,Listener,OrderCreatedStruct} from '@ticketing_app/common_code'
import { Message } from 'node-nats-streaming'
import {queueGroupName} from './queueGroupName'
import { expirationQueue } from '../../queues/expiration-queue'
 
export class OrderCreatedListener extends Listener<OrderCreatedStruct>{
    subject: Subjects.OrderCreated=Subjects.OrderCreated
    queueGroupName=queueGroupName

    async onMessage(data:OrderCreatedStruct['data'], msg: Message) {
        const delay=new Date(data.expiresAt).getTime()-new Date().getTime()
        await expirationQueue.add({
            orderId:data.id
        },{
            delay
        })

        msg.ack()
    }
}