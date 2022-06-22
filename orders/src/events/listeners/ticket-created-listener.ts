import { Queue_group_name } from './QueueGroupName';
import {Subjects,TicketCreatedStruct,Listener} from '@ticketing_app/common_code'
import {Message} from 'node-nats-streaming'
import {addTicketOrder,Ticket} from '../../models/ticket'

export class TicketCreatedListener extends Listener<TicketCreatedStruct>{
subject: Subjects.TicketCreated=Subjects.TicketCreated;
queueGroupName=Queue_group_name;

async onMessage(data:TicketCreatedStruct['data'], msg: Message) {
    const {title,price,id} =data
    const ticket= addTicketOrder({title,price,id})
    await ticket.save()

    msg.ack()
}
} 