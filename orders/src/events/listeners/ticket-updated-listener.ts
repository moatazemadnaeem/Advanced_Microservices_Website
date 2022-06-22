import { Queue_group_name } from './QueueGroupName';
import {Subjects,TicketUpdatedStruct,Listener} from '@ticketing_app/common_code'
import {Message} from 'node-nats-streaming'
import {addTicketOrder,Ticket} from '../../models/ticket'

export class TicketUpdatedListener extends Listener<TicketUpdatedStruct>{
subject: Subjects.TicketUpdated=Subjects.TicketUpdated;
queueGroupName=Queue_group_name;

async onMessage(data:TicketUpdatedStruct['data'], msg: Message) {
    console.log(data.version)
    const ticket=await Ticket.findOne({
        _id:data.id,
        version:data.version-1
    })

    if(!ticket){
        throw new Error('Ticket not found');
    }

    const {title,price} =data;

    ticket.set({title,price});
    await ticket.save()
    msg.ack()
}
} 